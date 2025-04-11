const User = require("../models/User");
const jwt = require("jsonwebtoken");

const protectRoute = async (req, res, next) => {
  try {
    if (req.headers["X-Guest-User"] === "true") {
      return next();
    }

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "Unauthorized: No token found." });
    }

    const token = authHeader.split(" ")[1];

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res
            .status(401)
            .json({ error: "Unauthorized: Token has expired." });
        }
        return res.status(401).json({ error: "Unauthorized: Invalid token." });
      }

      // Token is valid, fetch the user
      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }

      // Attach the user to the request object and proceed
      req.user = user;
      next();
    });
  } catch (error) {
    console.error("Error in protectRoute middleware:", error.message);
    res.status(500).json({
      error: "An internal server error occurred.",
    });
  }
};

module.exports = { protectRoute };
