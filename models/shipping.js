const mongoose = require("mongoose");

const shippingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fullName: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    postalCode: { type: String, required: true },
    landmark: { type: String },
    products: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true }, // Price of the product at the time of order
        images: [{ type: String, required: false }],
      },
    ],
    totalPrice: { type: Number, required: true }, // Total price of the shipment
    // shippingMethod: { type: String, default: "Standard" }, // e.g., Standard, Express
    // trackingNumber: { type: String }, // Optional tracking number
    // carrier: { type: String }, // e.g., FedEx, UPS
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date }, // Timestamp for when the shipment was delivered
  },
  { timestamps: true }
);

const Shipping = mongoose.model("Shipping", shippingSchema);
module.exports = Shipping;
