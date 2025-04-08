const mongoose = require("mongoose");
const Cart = require("../models/Cart");
const Shipping = require("../models/shipping");
// const Shipping = require("../models/Shipping");

// Create PaymentAttempt model if it doesn't exist
const PaymentAttempt = mongoose.model(
  "PaymentAttempt",
  new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderId: { type: String },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["success", "failed"], required: true },
    timestamp: { type: Date, default: Date.now },
    errorCode: { type: String },
    errorMessage: { type: String },
  })
);

// Get abandoned cart metrics
const getAbandonedCartMetrics = async (req, res) => {
  try {
    const { period = 30 } = req.query; // Default to last 30 days

    // Calculate date for period
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    // Get all active carts
    const activeCarts = await Cart.find({
      "items.0": { $exists: true }, // Cart has at least one item
      updatedAt: { $gte: startDate },
    }).populate("userId", "name email");

    // Calculate total value of abandoned carts
    let totalValue = 0;
    const cartDetails = [];

    for (const cart of activeCarts) {
      // For each cart, calculate its value
      let cartValue = 0;

      for (const item of cart.items) {
        // You would need to fetch product prices here
        // This is a simplified example
        const product = await mongoose
          .model("Product")
          .findById(item.productId);
        if (product) {
          cartValue += product.price * item.quantity;
        }
      }

      totalValue += cartValue;

      cartDetails.push({
        userId: cart.userId._id,
        userName: cart.userId.name,
        userEmail: cart.userId.email,
        itemCount: cart.items.length,
        cartValue,
        lastUpdated: cart.updatedAt,
      });
    }

    res.status(200).json({
      success: true,
      data: {
        totalAbandonedCarts: activeCarts.length,
        totalValue,
        averageCartValue:
          activeCarts.length > 0 ? totalValue / activeCarts.length : 0,
        cartDetails,
      },
    });
  } catch (error) {
    console.error("Error fetching abandoned cart metrics:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch abandoned cart metrics",
      error: error.message,
    });
  }
};

// Get failed payment metrics
const getFailedPaymentMetrics = async (req, res) => {
  try {
    const { period = 30 } = req.query; // Default to last 30 days

    // Calculate date for period
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    // Get all payment attempts
    const paymentAttempts = await PaymentAttempt.find({
      timestamp: { $gte: startDate },
    });

    // Calculate metrics
    const totalAttempts = paymentAttempts.length;
    const failedAttempts = paymentAttempts.filter(
      (attempt) => attempt.status === "failed"
    ).length;
    const successfulAttempts = totalAttempts - failedAttempts;

    // Calculate failure rate
    const failureRate =
      totalAttempts > 0 ? (failedAttempts / totalAttempts) * 100 : 0;

    // Group failed payments by error code
    const errorBreakdown = {};
    paymentAttempts
      .filter((attempt) => attempt.status === "failed")
      .forEach((attempt) => {
        const errorCode = attempt.errorCode || "unknown";
        if (!errorBreakdown[errorCode]) {
          errorBreakdown[errorCode] = {
            count: 0,
            message: attempt.errorMessage || "Unknown error",
          };
        }
        errorBreakdown[errorCode].count++;
      });

    res.status(200).json({
      success: true,
      data: {
        totalAttempts,
        failedAttempts,
        successfulAttempts,
        failureRate,
        errorBreakdown,
      },
    });
  } catch (error) {
    console.error("Error fetching failed payment metrics:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch failed payment metrics",
      error: error.message,
    });
  }
};

// Get checkout funnel metrics
const getCheckoutFunnelMetrics = async (req, res) => {
  try {
    const { period = 30 } = req.query; // Default to last 30 days

    // Calculate date for period
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    // Get cart views (you would need to track this separately)
    // This is a placeholder
    const cartViews = 1000; // Example value

    // Get checkout initiations (you would need to track this separately)
    // This is a placeholder
    const checkoutInitiations = 500; // Example value

    // Get successful orders
    const successfulOrders = await Shipping.countDocuments({
      createdAt: { $gte: startDate },
    });

    // Calculate conversion rates
    const cartToCheckoutRate =
      cartViews > 0 ? (checkoutInitiations / cartViews) * 100 : 0;
    const checkoutToOrderRate =
      checkoutInitiations > 0
        ? (successfulOrders / checkoutInitiations) * 100
        : 0;
    const cartToOrderRate =
      cartViews > 0 ? (successfulOrders / cartViews) * 100 : 0;

    res.status(200).json({
      success: true,
      data: {
        cartViews,
        checkoutInitiations,
        successfulOrders,
        cartToCheckoutRate,
        checkoutToOrderRate,
        cartToOrderRate,
        dropOffPoints: {
          cartToCheckout: cartViews - checkoutInitiations,
          checkoutToOrder: checkoutInitiations - successfulOrders,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching checkout funnel metrics:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch checkout funnel metrics",
      error: error.message,
    });
  }
};

module.exports = {
  getAbandonedCartMetrics,
  getFailedPaymentMetrics,
  getCheckoutFunnelMetrics,
};
