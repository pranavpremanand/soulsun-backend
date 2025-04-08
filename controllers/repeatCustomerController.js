const mongoose = require("mongoose");
const Shipping = require("../models/shipping");
// const Shipping = require("../models/Shipping");
// const User = require("../models/User");

// Get repeat customer metrics
const getRepeatCustomerMetrics = async (req, res) => {
  try {
    // Get customer order counts
    const customerOrders = await Shipping.aggregate([
      {
        $group: {
          _id: "$user",
          orderCount: { $sum: 1 },
          totalSpent: { $sum: "$totalPrice" },
          firstOrder: { $min: "$createdAt" },
          lastOrder: { $max: "$createdAt" },
        },
      },
    ]);

    // Calculate metrics
    const totalCustomers = customerOrders.length;
    const repeatCustomers = customerOrders.filter(
      (customer) => customer.orderCount > 1
    ).length;
    const oneTimeCustomers = totalCustomers - repeatCustomers;

    // Calculate repeat purchase rate
    const repeatPurchaseRate =
      totalCustomers > 0 ? (repeatCustomers / totalCustomers) * 100 : 0;

    // Calculate average orders per customer
    const totalOrders = customerOrders.reduce(
      (sum, customer) => sum + customer.orderCount,
      0
    );
    const averageOrdersPerCustomer =
      totalCustomers > 0 ? totalOrders / totalCustomers : 0;

    res.status(200).json({
      success: true,
      data: {
        totalCustomers,
        repeatCustomers,
        oneTimeCustomers,
        repeatPurchaseRate,
        averageOrdersPerCustomer,
      },
    });
  } catch (error) {
    console.error("Error fetching repeat customer metrics:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch repeat customer metrics",
      error: error.message,
    });
  }
};

// Get loyal customers (customers with most orders)
const getLoyalCustomers = async (req, res) => {
  try {
    const { limit = 10, minOrders = 2 } = req.query;

    const loyalCustomers = await Shipping.aggregate([
      {
        $group: {
          _id: "$user",
          orderCount: { $sum: 1 },
          totalSpent: { $sum: "$totalPrice" },
          firstOrder: { $min: "$createdAt" },
          lastOrder: { $max: "$createdAt" },
        },
      },
      { $match: { orderCount: { $gte: parseInt(minOrders) } } },
      { $sort: { orderCount: -1 } },
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
          averageOrderValue: { $divide: ["$totalSpent", "$orderCount"] },
          daysSinceFirstOrder: {
            $divide: [
              { $subtract: [new Date(), "$firstOrder"] },
              1000 * 60 * 60 * 24,
            ],
          },
          daysSinceLastOrder: {
            $divide: [
              { $subtract: [new Date(), "$lastOrder"] },
              1000 * 60 * 60 * 24,
            ],
          },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: loyalCustomers,
    });
  } catch (error) {
    console.error("Error fetching loyal customers:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch loyal customers",
      error: error.message,
    });
  }
};

// Get customer retention cohorts
const getCustomerRetentionCohorts = async (req, res) => {
  try {
    // Get all customers with their first order date
    const customerFirstOrders = await Shipping.aggregate([
      { $sort: { createdAt: 1 } },
      {
        $group: {
          _id: "$user",
          firstOrderDate: { $first: "$createdAt" },
          orders: { $push: "$createdAt" },
        },
      },
    ]);

    // Group customers by cohort (month of first order)
    const cohorts = {};

    customerFirstOrders.forEach((customer) => {
      const firstOrderDate = new Date(customer.firstOrderDate);
      const cohortKey = `${firstOrderDate.getFullYear()}-${String(
        firstOrderDate.getMonth() + 1
      ).padStart(2, "0")}`;

      if (!cohorts[cohortKey]) {
        cohorts[cohortKey] = {
          totalCustomers: 0,
          retentionByMonth: {},
        };
      }

      cohorts[cohortKey].totalCustomers++;

      // Calculate retention for each subsequent month
      customer.orders.forEach((orderDate) => {
        const orderMonth = new Date(orderDate);
        const monthDiff =
          (orderMonth.getFullYear() - firstOrderDate.getFullYear()) * 12 +
          (orderMonth.getMonth() - firstOrderDate.getMonth());

        if (monthDiff > 0) {
          if (!cohorts[cohortKey].retentionByMonth[monthDiff]) {
            cohorts[cohortKey].retentionByMonth[monthDiff] = 0;
          }
          cohorts[cohortKey].retentionByMonth[monthDiff]++;
        }
      });
    });

    // Calculate retention percentages
    Object.keys(cohorts).forEach((cohortKey) => {
      const cohort = cohorts[cohortKey];
      Object.keys(cohort.retentionByMonth).forEach((month) => {
        cohort.retentionByMonth[month] =
          (cohort.retentionByMonth[month] / cohort.totalCustomers) * 100;
      });
    });

    res.status(200).json({
      success: true,
      data: cohorts,
    });
  } catch (error) {
    console.error("Error fetching customer retention cohorts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch customer retention cohorts",
      error: error.message,
    });
  }
};

module.exports = {
  getRepeatCustomerMetrics,
  getLoyalCustomers,
  getCustomerRetentionCohorts,
};
