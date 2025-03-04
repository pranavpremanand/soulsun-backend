// initCoupons.js

const mongoose = require("mongoose");
const Coupon = require("./models/Coupon");
const dotenv = require("dotenv");

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  const coupons = [
    { code: "DISCOUNT10", discount: 10, expiryDate: new Date("2025-12-31") },
    { code: "DISCOUNT20", discount: 20, expiryDate: new Date("2025-12-31") },
  ];

  Coupon.insertMany(coupons)
    .then(() => {
      console.log("Coupons initialized");
      mongoose.connection.close();
    })
    .catch((err) => console.log(err));
})
.catch((err) => console.log(err));
