const mongoose = require("mongoose");


const profileSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fullName:{ type: String, required: true },
    address: { type: String, },
    city: { type: String,},
    state: { type: String},
    phoneNumber: { type: String, required: true },
    postalCode: { type: String},
    landmark: { type: String},
    dob:{type:String}
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", profileSchema);