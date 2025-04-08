const mongoose = require("mongoose");
const Shipping = require("../models/shipping");

// Get total sales and revenue
const getTotalSales = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Build date filter if provided
    const dateFilter = {};
    if (startDate) dateFilter.createdAt = { $gte: new Date(startDate) };
    if (endDate)
      dateFilter.createdAt = {
        ...dateFilter.createdAt,
        $lte: new Date(endDate),
      };

    // Aggregate total sales
    const salesData = await Shipping.aggregate([
      { $match: { ...dateFilter } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$totalPrice" },
          averageOrderValue: { $avg: "$totalPrice" },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data:
        salesData.length > 0
          ? salesData[0]
          : { totalOrders: 0, totalRevenue: 0, averageOrderValue: 0 },
    });
  } catch (error) {
    console.error("Error fetching sales data:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch sales data",
      error: error.message,
    });
  }
};

// Get top selling products
const getTopSellingProducts = async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const topProducts = await Shipping.aggregate([
      //   { $match: { isDelivered: true } },
      { $unwind: "$products" },
      {
        $group: {
          _id: "$products._id",
          productName: { $first: "$products.name" },
          totalQuantitySold: { $sum: "$products.quantity" },
          totalRevenue: {
            $sum: { $multiply: ["$products.price", "$products.quantity"] },
          },
          averagePrice: { $avg: "$products.price" },
        },
      },
      { $sort: { totalQuantitySold: -1 } },
      { $limit: parseInt(limit) },
    ]);

    res.status(200).json({
      success: true,
      data: topProducts,
    });
  } catch (error) {
    console.error("Error fetching top selling products:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch top selling products",
      error: error.message,
    });
  }
};

// Get sales trends (daily, weekly, monthly)
const getSalesTrends = async (req, res) => {
  try {
    const { period = "daily", startDate, endDate } = req.query;

    // Build date filter
    const dateFilter = {};
    if (startDate) dateFilter.createdAt = { $gte: new Date(startDate) };
    if (endDate)
      dateFilter.createdAt = {
        ...dateFilter.createdAt,
        $lte: new Date(endDate),
      };

    // Define grouping based on period
    let groupStage;
    if (period === "daily") {
      groupStage = {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          date: { $first: "$createdAt" },
          orders: { $sum: 1 },
          revenue: { $sum: "$totalPrice" },
        },
      };
    } else if (period === "weekly") {
      groupStage = {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            week: { $week: "$createdAt" },
          },
          date: { $first: "$createdAt" },
          orders: { $sum: 1 },
          revenue: { $sum: "$totalPrice" },
        },
      };
    } else if (period === "monthly") {
      groupStage = {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          date: { $first: "$createdAt" },
          orders: { $sum: 1 },
          revenue: { $sum: "$totalPrice" },
        },
      };
    }

    const salesTrends = await Shipping.aggregate([
      { $match: dateFilter },
      groupStage,
      { $sort: { date: 1 } },
    ]);

    res.status(200).json({
      success: true,
      period,
      data: salesTrends,
    });
  } catch (error) {
    console.error("Error fetching sales trends:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch sales trends",
      error: error.message,
    });
  }
};

module.exports = {
  getTotalSales,
  getTopSellingProducts,
  getSalesTrends,
};
