const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectToDatabase = require("./config/db");

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/product");
const shippingRoutes = require("./routes/shipping");
const coupanRoutes = require("./routes/coupon");
const wishlistRoutes = require("./routes/wishlist");
const profileRoutes = require("./routes/profile");
const categoriesRoutes = require("./routes/category");
const health = require("./routes/health");
const analyticsRoutes = require("./routes/analyticsRoutes");
const storeUserRequest = require("./middlewares/storeUserRequest");

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Configure CORS
const corsOptions = {
  origin: "*",
  methods: ["GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
    "Access-Control-Allow-Origin",
  ],
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Pre-flight request for all routes

// Serve static files from the 'assets' folder
app.use("/public", express.static(path.join(__dirname, "public")));

// Middleware to ensure DB connection for each request
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    res.status(500).json({ error: "Database connection failed" });
  }
});
// Register routes
app.use("/api/analytics", analyticsRoutes);
app.use(storeUserRequest);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/shipping", shippingRoutes);
app.use("/api/coupan", coupanRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/category", categoriesRoutes);
app.use("/api/health", health);
app.use("/api/analytics", analyticsRoutes);

// Export the app as a serverless function
module.exports = app;
