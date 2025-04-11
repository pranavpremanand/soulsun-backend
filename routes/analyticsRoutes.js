const express = require("express");
const salesController = require("../controllers/salesController");
const customerController = require("../controllers/customerController");
const productController = require("../controllers/adminProductController");
const repeatCustomerController = require("../controllers/repeatCustomerController");
const cartController = require("../controllers/cartController");
const ProductView = require("../models/ProductView");
const { addView } = require("../controllers/productController");
const { protectRoute } = require("../middlewares/authMiddleware");
const Analytics = require("../models/Analytics");

const router = express.Router();

// Sales & Revenue routes
router.get("/sales/total", salesController.getTotalSales);
router.get("/sales/top-products", salesController.getTopSellingProducts);
router.get("/sales/trends", salesController.getSalesTrends);

// Customer routes
router.get("/customers", salesController.getSalesTrends);

// Customer routes
router.get("/customers/metrics", customerController.getCustomerMetrics);
router.get("/customers/top", customerController.getTopCustomers);
router.get(
  "/customers/spending-distribution",
  customerController.getCustomerSpendingDistribution
);

// Product routes
router.get("/products/most-viewed", productController.getMostViewedProducts);
router.get(
  "/products/most-purchased",
  productController.getMostPurchasedProducts
);
router.get(
  "/products/:productId/performance",
  productController.getProductPerformance
);

// Repeat Customer routes
router.get(
  "/repeat-customers/metrics",
  repeatCustomerController.getRepeatCustomerMetrics
);
router.get(
  "/repeat-customers/loyal",
  repeatCustomerController.getLoyalCustomers
);
router.get(
  "/repeat-customers/retention-cohorts",
  repeatCustomerController.getCustomerRetentionCohorts
);

// Cart & Checkout routes
router.get("/cart/abandoned", cartController.getAbandonedCartMetrics);
router.get("/checkout/failed-payments", cartController.getFailedPaymentMetrics);
router.get("/checkout/funnel", cartController.getCheckoutFunnelMetrics);
router.get("/device-stats", cartController.getDeviceStats);
router.get("/device-stats", cartController.getDeviceStats);
router.post("/search-query", cartController.addSearchquery);
router.get("/search-query", cartController.getSearchquery);

router.get("/cart-analytics", cartController.getCartAnalytics);
router.post("/cart-analytics", cartController.createCartAnalytics);

router.post("/add-view", addView);

router.post("/track-visit", async (req, res) => {
  try {
    const { source, medium, campaign, timestamp, path } = req.body;

    console.log({ source, medium, campaign, timestamp, path });

    await Analytics.create({
      source,
      medium,
      campaign,
      timestamp,
      path,
    });

    res.status(200).json({ message: "Tracked" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});
router.get("/track-visit", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      source,
      medium,
      campaign,
      startDate,
      endDate,
    } = req.query;

    const query = {};

    if (source) query.source = source;
    if (medium) query.medium = medium;
    if (campaign) query.campaign = campaign;

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const analytics = await Analytics.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Analytics.countDocuments(query);

    res.json({
      data: analytics,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("Fetch analytics error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
