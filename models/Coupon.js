const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    description: { type: String },
    discountType: { type: String, enum: ["percentage", "fixed"], required: true },
    discountValue: { type: Number, required: true },
    usageLimit: { type: Number, default: 5 }, // Total times the coupon can be used
    usageLimitPerUser: { type: Number, default: 5 }, // Per user usage limit
    minimumAmount: { type: Number, default: 0 },
    expiryDate: { type: Date, required: true },

    usedBy: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        timesUsed: { type: Number, default: 0 },
      },
    ],
  },
  { timestamps: true }
);

const Coupon = mongoose.model("Coupon", couponSchema);
module.exports = Coupon;
