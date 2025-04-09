// models/UserRequest.js

const mongoose = require("mongoose");

const userRequestSchema = new mongoose.Schema({
  userAgent: { type: String, required: true },
  deviceType: { type: String, required: true },
  requestData: { type: Object, required: true },
  createdAt: { type: Date, default: Date.now },
});

const UserRequest = mongoose.model("UserRequest", userRequestSchema);

module.exports = UserRequest;
