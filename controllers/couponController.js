// controllers/couponController.js

const asyncCatch = require("../middlewares/asyncTryCatch");
const { createCouponSchema } = require("../middlewares/validator");
const Coupon = require("../models/Coupon");

const applyCoupon = async (req, res) => {
  try {
    const { code, cartTotal, guestUser } = req.body;
    let isGuestUser = guestUser;
    // const isGuestUser = req.headers["x-guest-user"] === "true";
    const userId = isGuestUser ? null : req.user.id;
    console.log(userId, "asdfasdfsdfsdf");
    // 1️⃣ Check if the coupon exists
    const coupon = await Coupon.findOne({ code });
    if (!coupon) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid coupon code" });
    }

    // 2️⃣ Check if the coupon is expired
    const now = new Date();
    if (coupon.expiryDate < now) {
      return res
        .status(400)
        .json({ success: false, message: "Coupon has expired" });
    }

    // 3️⃣ Check if the coupon usage limit is reached
    if (!isGuestUser) {
      if (coupon.usageLimit <= 0) {
        return res
          .status(400)
          .json({ success: false, message: "Coupon usage limit reached" });
      }
    }

    // 4️⃣ Check if the user has already used this coupon more than allowed
    let userCouponUsage;
    if (userId) {
      userCouponUsage = coupon.usedBy.find(
        (u) => u.userId.toString() === userId
      );
    }

    if (
      userCouponUsage &&
      userCouponUsage.timesUsed >= coupon.usageLimitPerUser
    ) {
      return res
        .status(400)
        .json({ success: false, message: "You have already used this coupon" });
    }

    // 5️⃣ Check if the cart total meets the minimum required amount
    if (cartTotal < coupon.minimumAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum purchase required is ${coupon.minimumAmount}`,
      });
    }

    // 6️⃣ Calculate the discount
    let discount = 0;
    if (coupon.discountType === "percentage") {
      discount = (cartTotal * coupon.discountValue) / 100;
    } else {
      discount = coupon.discountValue;
    }

    // Ensure discount does not exceed cart total
    discount = Math.min(discount, cartTotal);

    // 7️⃣ Deduct the coupon usage limit
    coupon.usageLimit -= 1;
    if (userId) {
      // 8️⃣ Update coupon's `usedBy` list
      if (userCouponUsage) {
        userCouponUsage.timesUsed += 1;
      } else {
        coupon.usedBy.push({ userId, timesUsed: 1 });
      }
    }
    await coupon.save();

    return res.json({
      success: true,
      message: "Coupon applied successfully",
      discount,
      finalTotal: cartTotal - discount,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const createCoupan = asyncCatch(createCouponSchema, async (req, res) => {
  try {
    // Check if the coupon code already exists in the database
    const existingCoupon = await Coupon.findOne({ code: req.body.code });

    if (existingCoupon) {
      return res.status(400).json({ message: "Coupon code already exists" });
    }

    // If no coupon exists, proceed to create a new one
    const coupon = new Coupon(req.body);
    await coupon.save();
    res.status(200).json({ message: "Coupon created successfully", coupon });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating coupon", error: error.message });
  }
});

// Get all coupons
const getAllCoupan = async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.status(200).json(coupons);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching coupons", error: error.message });
  }
};

// Get a single coupon by ID
const getCoupanById = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });

    res.status(200).json(coupon);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching coupon", error: error.message });
  }
};

const deleteCoupan = async (req, res) => {
  const { id } = req.body;
  try {
    const coupon = await Coupon.findById(id);
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });
    // Use the id to delete the coupon
    await Coupon.deleteOne({ _id: id });

    res.status(200).json({ message: "Coupon is deleted." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting coupon", error: error.message });
  }
};
const updateCoupon = asyncCatch(createCouponSchema, async (req, res) => {
  try {
    // Find the coupon by ID
    const coupon = await Coupon.findById(req.params.id);

    // If coupon not found, return a 404 error
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    // Check if the coupon code is being updated and if the new code already exists
    if (req.body.code && req.body.code !== coupon.code) {
      const existingCoupon = await Coupon.findOne({ code: req.body.code });

      if (existingCoupon) {
        return res.status(400).json({ message: "Coupon code already exists" });
      }
    }

    // Update the coupon with the new data
    Object.assign(coupon, req.body); // Merge the request body with the existing coupon

    // Save the updated coupon
    await coupon.save();

    res.status(200).json({ message: "Coupon updated successfully", coupon });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating coupon", error: error.message });
  }
});

module.exports = {
  applyCoupon,
  createCoupan,
  getAllCoupan,
  getCoupanById,
  deleteCoupan,
  updateCoupon,
};
