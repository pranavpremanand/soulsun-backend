// routes/wishlist.js
const express = require("express");
const { addToWishlist, getWishlist } = require("../controllers/wishlistController");
const { protectRoute } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", protectRoute, addToWishlist); // Add to wishlist
router.get("/", protectRoute, getWishlist);   // Get wishlist

module.exports = router;
