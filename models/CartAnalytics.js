const mongoose = require("mongoose");

// CartAnalytics schema
const cartAnalyticsSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

const CartAnalytics = mongoose.model("CartAnalytics", cartAnalyticsSchema);

module.exports = CartAnalytics;
