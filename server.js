// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/product");
const shippingRoutes = require("./routes/shipping");
const coupanRoutes = require("./routes/coupon");
const profileRoutes = require("./routes/profile");

const wishlistRoutes = require("./routes/wishlist");
const categoriesRoutes = require("./routes/category");
const analyticsRoutes = require("./routes/analyticsRoutes");
const health = require("./routes/health");
const storeUserRequest = require("./middlewares/storeUserRequest");

dotenv.config();
const app = express();

app.use(express.json());
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
    "X-Guest-User",
  ],
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Pre-flight request for all routes
// Serve static files from the 'assets' folder
app.use("/public", express.static(path.join(__dirname, "public")));
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
