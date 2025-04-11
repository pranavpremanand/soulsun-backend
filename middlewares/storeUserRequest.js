const UAParser = require("ua-parser-js");
const UserRequest = require("../models/UserRequest");
const mongoose = require("mongoose");

/**
 * Middleware to track user requests from different devices - Vercel optimized
 */
const storeUserRequest = async (req, res, next) => {
  // Try to store the request data, but never block the main request flow
  try {
    // Ensure database connection is active (important for serverless)
    if (mongoose.connection.readyState !== 1) {
      // If not connected, try to connect (assumes connection string is in env vars)
      // This is important in serverless where connections may close between invocations
      if (!process.env.MONGODB_URI) {
        console.error("MONGODB_URI environment variable not set");
        return next();
      }

      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000, // Timeout quickly if DB unavailable
      });
    }

    // Use UAParser for device detection
    const uaParser = new UAParser(req.headers["user-agent"] || "");
    const parsedResult = uaParser.getResult();

    console.log({ parsedResult });

    // Better device type detection
    let deviceType = "Desktop"; // Default
    if (parsedResult.device.type === "mobile") {
      deviceType = "Mobile";
    } else if (parsedResult.device.type === "tablet") {
      deviceType = "Tablet";
    }

    // Get client IP address (considering Vercel's specific headers)
    const ipAddress =
      req.headers["x-real-ip"] || // Vercel specific
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.connection?.remoteAddress ||
      "0.0.0.0";

    // Collect request data based on method
    let requestData;
    if (req.method === "GET") {
      requestData = req.query || {};
    } else if (["POST", "PUT", "PATCH"].includes(req.method)) {
      requestData = req.body || {};
    } else {
      requestData = {};
    }

    // Safe stringify of requestData (to handle circular references)
    let safeRequestData;
    try {
      // Limit data size to prevent document size issues
      const stringifiedData = JSON.stringify(requestData);
      safeRequestData =
        stringifiedData.length > 5000
          ? { truncated: true, size: stringifiedData.length }
          : requestData;
    } catch (e) {
      safeRequestData = { error: "Could not serialize request data" };
    }

    // Prepare the data to store
    const userRequestData = {
      userAgent: req.headers["user-agent"] || "Unknown",
      deviceType,
      deviceDetails: {
        browser: parsedResult.browser.name || "Unknown",
        browserVersion: parsedResult.browser.version || "Unknown",
        os: parsedResult.os.name || "Unknown",
        osVersion: parsedResult.os.version || "Unknown",
        device: parsedResult.device.model || "Unknown",
      },
      ipAddress,
      requestMethod: req.method,
      requestUrl: req.url || req.originalUrl || "/",
      requestData: safeRequestData,
      timestamp: new Date(),
      environment: process.env.NODE_ENV || "development",
      // Add Vercel-specific info
      vercelInfo: {
        region: process.env.VERCEL_REGION || "unknown",
        isProduction: process.env.VERCEL_ENV === "production",
      },
    };

    // Save the request data to MongoDB with timeout
    const newUserRequest = new UserRequest(userRequestData);

    // Use a promise with timeout to prevent hanging
    const saveWithTimeout = new Promise(async (resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error("Database save operation timed out"));
      }, 2500); // 2.5 second timeout

      try {
        await newUserRequest.save();
        clearTimeout(timeoutId);
        resolve();
      } catch (error) {
        clearTimeout(timeoutId);
        reject(error);
      }
    });

    await saveWithTimeout;
  } catch (error) {
    // Log the error but don't stop the request processing
    console.error("Error storing user request:", error.message);
  }

  // Always continue with the next middleware or route handler
  next();
};

module.exports = storeUserRequest;
