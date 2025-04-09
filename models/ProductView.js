const mongoose = require("mongoose");

const ProductViewSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      unique: true, // Ensure one view document per product
    },
    views: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

const ProductView = mongoose.model("ProductView", ProductViewSchema);

module.exports = ProductView;
