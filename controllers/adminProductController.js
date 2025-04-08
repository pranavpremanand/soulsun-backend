const mongoose = require("mongoose");
const Shipping = require("../models/shipping");
const Product = require("../models/product");
const ProductView = require("../models/ProductView");
// const Product = require("../models/Product");
// const Shipping = require("../models/Shipping");

// Get most viewed products
const getMostViewedProducts = async (req, res) => {
  try {
    const { limit = 10, period } = req.query;

    // Build date filter if period is provided
    const dateFilter = {};
    if (period) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(period));
      dateFilter.timestamp = { $gte: startDate };
    }

    const mostViewedProducts = await Product.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: "$productId",
          viewCount: { $sum: 1 },
          uniqueViewers: { $addToSet: "$userId" },
        },
      },
      { $sort: { viewCount: -1 } },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $project: {
          _id: 1,
          name: "$productDetails.name",
          price: "$productDetails.price",
          viewCount: 1,
          uniqueViewers: { $size: "$uniqueViewers" },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: mostViewedProducts,
    });
  } catch (error) {
    console.error("Error fetching most viewed products:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch most viewed products",
      error: error.message,
    });
  }
};

// Get most purchased products
const getMostPurchasedProducts = async (req, res) => {
  try {
    const { limit = 10, period } = req.query;

    // Build date filter if period is provided
    const dateFilter = {};
    if (period) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(period));
      dateFilter.createdAt = { $gte: startDate };
    }

    const mostPurchasedProducts = await Shipping.aggregate([
      { $match: { ...dateFilter } },
      { $unwind: "$products" },
      {
        $group: {
          _id: "$products._id",
          name: { $first: "$products.name" },
          totalQuantity: { $sum: "$products.quantity" },
          totalRevenue: {
            $sum: { $multiply: ["$products.price", "$products.quantity"] },
          },
          orderCount: { $sum: 1 },
        },
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: parseInt(limit) },
    ]);

    res.status(200).json({
      success: true,
      data: mostPurchasedProducts,
    });
  } catch (error) {
    console.error("Error fetching most purchased products:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch most purchased products",
      error: error.message,
    });
  }
};

// Get product performance metrics
const getProductPerformance = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid product ID" });
    }

    // Get purchase data
    const purchaseData = await Shipping.aggregate([
      { $unwind: "$products" },
      { $match: { "products._id": mongoose.Types.ObjectId(productId) } },
      {
        $group: {
          _id: null,
          totalQuantitySold: { $sum: "$products.quantity" },
          totalRevenue: {
            $sum: { $multiply: ["$products.price", "$products.quantity"] },
          },
          orderCount: { $sum: 1 },
        },
      },
    ]);

    // Get view data
    const viewData = await ProductView.aggregate([
      { $match: { productId: mongoose.Types.ObjectId(productId) } },
      {
        $group: {
          _id: null,
          totalViews: { $sum: 1 },
          uniqueViewers: { $addToSet: "$userId" },
        },
      },
    ]);

    // Calculate conversion rate
    const views = viewData.length > 0 ? viewData[0].totalViews : 0;
    const purchases = purchaseData.length > 0 ? purchaseData[0].orderCount : 0;
    const conversionRate = views > 0 ? (purchases / views) * 100 : 0;

    res.status(200).json({
      success: true,
      data: {
        productId,
        sales:
          purchaseData.length > 0
            ? {
                totalQuantitySold: purchaseData[0].totalQuantitySold,
                totalRevenue: purchaseData[0].totalRevenue,
                orderCount: purchaseData[0].orderCount,
              }
            : { totalQuantitySold: 0, totalRevenue: 0, orderCount: 0 },
        views:
          viewData.length > 0
            ? {
                totalViews: viewData[0].totalViews,
                uniqueViewers: viewData[0].uniqueViewers.length,
              }
            : { totalViews: 0, uniqueViewers: 0 },
        conversionRate,
      },
    });
  } catch (error) {
    console.error("Error fetching product performance:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch product performance",
      error: error.message,
    });
  }
};

module.exports = {
  getMostViewedProducts,
  getMostPurchasedProducts,
  getProductPerformance,
};
