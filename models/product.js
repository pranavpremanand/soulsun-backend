
// models/Product.js
const mongoose = require("mongoose");


const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  Category: {type:mongoose.Schema.Types.ObjectId, ref:'Category', required: true },
  keywords: { type: [String], default: [] },
  images: [{ type: String, required: false }],
  bestSeller: { type: Boolean, default: false },
  material: { type: String },
  size: { type: String },
  colorOptions: { type: [String] },
  careInstructions: { type: String },
  status:{type:Boolean, default:true},
  whislistIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Wishlist" }],
},
{ timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
