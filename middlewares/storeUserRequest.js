const UserRequest = require("../models/UserRequest");

const storeUserRequest = async (req, res, next) => {
  // console.log("Starting request tracking middleware");

  // Continue with the main request flow immediately
  next();

  try {
    // console.log("Processing background tracking");
    const userAgent = req.headers["user-agent"] || "";
    // console.log("User agent:", userAgent);

    // Device detection logic
    let deviceType = "Desktop";
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Tablet/i.test(
        userAgent
      )
    ) {
      deviceType = /iPad|Tablet|Android(?!.*Mobile)/i.test(userAgent)
        ? "Tablet"
        : "Mobile";
    }
    // console.log("Detected device type:", deviceType);

    // Create document data
    const userRequestData = {
      userAgent,
      deviceType,
      requestData:
        req.method === "GET"
          ? { ...req.query }
          : req.body && typeof req.body === "object"
          ? { ...req.body }
          : {},
    };
    // console.log("Prepared data:", JSON.stringify(userRequestData));

    // Try to save
    // console.log("Attempting database save");
    const newUserRequest = new UserRequest(userRequestData);
    await newUserRequest.save();
    // console.log("Successfully saved to database");
  } catch (error) {
    console.error("[Device Tracking] Error details:", {
      message: error.message,
      stack: error.stack,
      code: error.code,
    });
  }
};

module.exports = storeUserRequest;
