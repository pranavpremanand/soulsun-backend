// routes/coupon.js

const express = require("express");
const router = express.Router();
const {
  applyCoupon,
  getAllCoupan,
  getCoupanById,
  createCoupan,
  deleteCoupan,
  updateCoupon,
} = require("../controllers/couponController");
const { protectRoute } = require("../middlewares/authMiddleware");

// Route to apply a coupon
router.post("/apply", applyCoupon);
router.get("/", protectRoute, getAllCoupan);
router.post("/", protectRoute, createCoupan);
router.get("/:id", protectRoute, getCoupanById);
router.put("/:id", protectRoute, updateCoupon);
router.delete("/", protectRoute, deleteCoupan);

module.exports = router;
