const useragent = require("useragent");
const UAParser = require("ua-parser-js"); // More reliable user agent parser
const UserRequest = require("../models/UserRequest");

/**
 * Middleware to track user requests from different devices
 */
const storeUserRequest = async (req, res, next) => {
  try {
    // Use both parsers for more reliable detection
    const agent = useragent.parse(req.headers["user-agent"]);
    const uaParser = new UAParser(req.headers["user-agent"]);
    const parsedResult = uaParser.getResult();

    console.log({ parsedResult });

    // Better device type detection
    let deviceType;
    if (
      parsedResult.device.type === "mobile" ||
      parsedResult.device.type === "tablet"
    ) {
      deviceType =
        parsedResult.device.type.charAt(0).toUpperCase() +
        parsedResult.device.type.slice(1);
    } else {
      deviceType = "Desktop";
    }

    // Get client IP address (considering proxies)
    const ipAddress =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.connection.remoteAddress;

    // Collect request data based on method
    let requestData;
    if (req.method === "GET") {
      requestData = req.query;
    } else if (["POST", "PUT", "PATCH"].includes(req.method)) {
      requestData = req.body;
    } else {
      requestData = {};
    }

    // Prepare the data to store
    const userRequestData = {
      userAgent: req.headers["user-agent"],
      deviceType,
      deviceDetails: {
        browser: parsedResult.browser.name,
        browserVersion: parsedResult.browser.version,
        os: parsedResult.os.name,
        osVersion: parsedResult.os.version,
        device: parsedResult.device.model || "Unknown",
      },
      ipAddress,
      requestMethod: req.method,
      requestUrl: req.originalUrl,
      requestData,
      timestamp: new Date(),
    };

    // Save the request data to MongoDB
    const newUserRequest = new UserRequest(userRequestData);
    await newUserRequest.save();

    // Continue with the next middleware or route handler
    next();
  } catch (error) {
    // Log the error but don't stop the request processing
    console.error("Error storing user request:", error);
    // Continue with the request even if tracking fails
    next();
  }
};

module.exports = storeUserRequest;
