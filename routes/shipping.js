// routes/shipping.js
const express = require("express");
const { addShipping, getShippingByUserId, getAllOrdersList, getSalesReport, updateShippingStatus, getStats } = require("../controllers/shippingController");
const { protectRoute } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", protectRoute, addShipping);
router.post("/status", protectRoute, updateShippingStatus);
router.get("/", protectRoute, getShippingByUserId);
router.get("/getStats", protectRoute, getStats);
router.get("/getAll", protectRoute, getAllOrdersList);
router.get("/getSales/:range", protectRoute, getSalesReport);

module.exports = router;
