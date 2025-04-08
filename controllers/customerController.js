const mongoose = require("mongoose");
const User = require("../models/User");
const Shipping = require("../models/shipping");

// Get new vs returning customers
const getCustomerMetrics = async (req, res) => {
  try {
    const { period = 30 } = req.query; // Default to last 30 days

    // Calculate date for new customers (registered within period)
    const newCustomerDate = new Date();
    newCustomerDate.setDate(newCustomerDate.getDate() - parseInt(period));

    // Count new customers
    const newCustomers = await User.countDocuments({
      role: "user",
      createdAt: { $gte: newCustomerDate },
    });

    // Count total customers
    const totalCustomers = await User.countDocuments({ role: "user" });

    // Calculate returning customers
    const returningCustomers = totalCustomers - newCustomers;

    // Get customers with orders
    const customersWithOrders = await Shipping.aggregate([
      {
        $group: {
          _id: "$user",
          orderCount: { $sum: 1 },
          totalSpent: { $sum: "$totalPrice" },
        },
      },
    ]);

    // Calculate average spending per customer
    const totalSpending = customersWithOrders.reduce(
      (sum, customer) => sum + customer.totalSpent,
      0
    );
    const averageSpending =
      customersWithOrders.length > 0
        ? totalSpending / customersWithOrders.length
        : 0;

    res.status(200).json({
      success: true,
      data: {
        totalCustomers,
        newCustomers,
        returningCustomers,
        customersWithOrders: customersWithOrders.length,
        averageSpending,
        customerRetentionRate:
          totalCustomers > 0 ? (returningCustomers / totalCustomers) * 100 : 0,
      },
    });
  } catch (error) {
    console.error("Error fetching customer metrics:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch customer metrics",
      error: error.message,
    });
  }
};

// Get top customers by spending
const getTopCustomers = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const topCustomers = await Shipping.aggregate([
      {
        $group: {
          _id: "$user",
          orderCount: { $sum: 1 },
          totalSpent: { $sum: "$totalPrice" },
          lastOrderDate: { $max: "$createdAt" },
        },
      },
      { $sort: { totalSpent: -1 } },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" },
      {
        $project: {
          _id: 1,
          name: "$userDetails.name",
          email: "$userDetails.email",
          orderCount: 1,
          totalSpent: 1,
          lastOrderDate: 1,
          averageOrderValue: { $divide: ["$totalSpent", "$orderCount"] },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: topCustomers,
    });
  } catch (error) {
    console.error("Error fetching top customers:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch top customers",
      error: error.message,
    });
  }
};

// Get customer spending distribution
const getCustomerSpendingDistribution = async (req, res) => {
  try {
    // Define spending ranges
    const ranges = [
      { min: 0, max: 1000, label: "₹0-₹1,000" },
      { min: 1001, max: 5000, label: "₹1,001-₹5,000" },
      { min: 5001, max: 10000, label: "₹5,001-₹10,000" },
      { min: 10001, max: 25000, label: "₹10,001-₹25,000" },
      { min: 25001, max: Infinity, label: "Above ₹25,000" },
    ];

    // Get total spending per customer
    const customerSpending = await Shipping.aggregate([
      {
        $group: {
          _id: "$user",
          totalSpent: { $sum: "$totalPrice" },
        },
      },
    ]);

    // Categorize customers by spending range
    const distribution = ranges.map((range) => {
      const count = customerSpending.filter(
        (customer) =>
          customer.totalSpent >= range.min && customer.totalSpent <= range.max
      ).length;

      return {
        range: range.label,
        customerCount: count,
        percentage:
          customerSpending.length > 0
            ? (count / customerSpending.length) * 100
            : 0,
      };
    });

    res.status(200).json({
      success: true,
      totalCustomersWithOrders: customerSpending.length,
      data: distribution,
    });
  } catch (error) {
    console.error("Error fetching customer spending distribution:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch customer spending distribution",
      error: error.message,
    });
  }
};

module.exports = {
  getCustomerMetrics,
  getTopCustomers,
  getCustomerSpendingDistribution,
};
