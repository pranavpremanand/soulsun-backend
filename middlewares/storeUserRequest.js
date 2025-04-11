const UserRequest = require("../models/UserRequest");

/**
 * Ultra-reliable device detection middleware for production use
 * Specifically optimized for live API environments and mobile detection
 */
const storeUserRequest = async (req, res, next) => {
  // Continue with the main request flow immediately
  next();

  // Handle tracking in the background to prevent blocking API responses
  try {
    const userAgent = req.headers["user-agent"] || "";

    // SIMPLE BUT EFFECTIVE MOBILE DETECTION
    let deviceType = "Desktop"; // Default to Desktop

    // Check common mobile identifiers in user agent string
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Tablet/i.test(
        userAgent
      )
    ) {
      // Further distinguish between tablets and phones
      if (/iPad|Tablet|Android(?!.*Mobile)/i.test(userAgent)) {
        deviceType = "Tablet";
      } else {
        deviceType = "Mobile";
      }
    }

    // Use a safe version of request data
    let requestData = {};
    try {
      if (req.method === "GET") {
        requestData = { ...req.query };
      } else if (req.body && typeof req.body === "object") {
        requestData = { ...req.body };
      }
    } catch (e) {
      requestData = { error: "Could not process request data" };
    }

    // Create a new document with just the essential fields
    const userRequestData = {
      userAgent,
      deviceType,
      requestData,
      // createdAt will be added automatically via schema default
    };

    // Save to database with error handling
    const newUserRequest = new UserRequest(userRequestData);
    await newUserRequest.save();
  } catch (error) {
    // Silent fail - log error but don't affect the main application
    console.error("[Device Tracking]", error.message);
  }
};

module.exports = storeUserRequest;
