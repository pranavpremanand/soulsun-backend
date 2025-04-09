const useragent = require("useragent");
const UserRequest = require("../models/UserRequest");

const storeUserRequest = async (req, res, next) => {
  try {
    // Parse the user-agent header to get device details
    const agent = useragent.parse(req.headers["user-agent"]);
    const deviceType = agent.device.family === "Other" ? "Desktop" : "Mobile"; // Detect device type

    // Prepare the data to store
    const userRequestData = {
      userAgent: req.headers["user-agent"],
      deviceType,
      requestData: req.body, // Data sent in the body of the request
    };

    // Save the request data to MongoDB
    const newUserRequest = new UserRequest(userRequestData);
    await newUserRequest.save();

    // Continue with the next middleware or route handler
    next();
  } catch (error) {
    console.error("Error storing user request:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = storeUserRequest;
