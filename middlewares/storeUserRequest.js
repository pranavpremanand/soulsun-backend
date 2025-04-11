const UserRequest = require("../models/UserRequest");
const mongoose = require("mongoose");

/**
 * Production-ready middleware for reliable device detection
 * Works with live APIs and focuses on detecting mobile devices
 */
const storeUserRequest = async (req, res, next) => {
  // Always continue the request flow, handle tracking in the background
  const tracking = (async () => {
    try {
      // Ensure database connection (critical for serverless environments)
      if (mongoose.connection.readyState !== 1) {
        console.log("Establishing database connection...");
        await mongoose.connect(
          process.env.MONGODB_URI || process.env.DATABASE_URL
        );
      }

      const userAgent = req.headers["user-agent"] || "";

      // COMPREHENSIVE MOBILE DETECTION
      // This detection combines multiple techniques for maximum reliability
      let deviceType = "Desktop"; // Default

      // Method 1: Keyword-based detection (most reliable for older devices)
      const mobileKeywords = [
        "android",
        "iphone",
        "ipod",
        "windows phone",
        "mobile",
        "blackberry",
        "webos",
        "opera mini",
        "opera mobi",
        "nokia",
        "samsung",
        "lg-",
        "mot-",
        "sonyericsson",
        "kindle",
        "silk",
      ];

      const lowerCaseUA = userAgent.toLowerCase();

      // Method 2: Screen size detection via headers (some clients provide this)
      const hasSmallScreen =
        req.headers["viewport-width"] &&
        parseInt(req.headers["viewport-width"]) < 768;

      // Method 3: Check if the user agent contains common mobile browser strings
      const hasMobileBrowser =
        /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          userAgent
        );

      // Method 4: Touchscreen detection (modern mobile browsers indicate this)
      const hasTouchScreen =
        /\b(TouchEvent|ontouchstart|touch-enabled|touch)\b/i.test(userAgent);

      // DECISION LOGIC FOR DEVICE TYPE
      if (
        // Primary check: keywords in user agent
        mobileKeywords.some((keyword) => lowerCaseUA.includes(keyword)) ||
        // Secondary check: mobile browser identifier
        hasMobileBrowser ||
        // Tertiary checks for edge cases
        hasSmallScreen ||
        hasTouchScreen
      ) {
        // Is it a tablet or phone?
        if (
          /ipad|tablet|playbook|silk|android(?!.*mobile)/i.test(lowerCaseUA) ||
          (req.headers["viewport-width"] &&
            parseInt(req.headers["viewport-width"]) >= 600 &&
            parseInt(req.headers["viewport-width"]) < 1200)
        ) {
          deviceType = "Tablet";
        } else {
          deviceType = "Mobile";
        }
      }

      // Collect request data (minimal for your schema)
      const requestData =
        req.method === "GET"
          ? req.query
          : req.body && typeof req.body === "object"
          ? req.body
          : {};

      // Create the document according to your schema
      const userRequestData = {
        userAgent: userAgent,
        deviceType: deviceType,
        requestData: requestData,
        // createdAt will use the schema default
      };

      // Save with a timeout to prevent hanging
      const savePromise = new Promise(async (resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Database save timed out"));
        }, 3000);

        try {
          const newUserRequest = new UserRequest(userRequestData);
          await newUserRequest.save();
          clearTimeout(timeout);
          resolve();
        } catch (error) {
          clearTimeout(timeout);
          reject(error);
        }
      });

      await savePromise;
      console.log(`Device tracked successfully: ${deviceType}`);
    } catch (error) {
      console.error("Error in device tracking:", error.message);
    }
  })();

  // Don't wait for tracking to complete - continue with the main request
  next();
};

module.exports = storeUserRequest;
