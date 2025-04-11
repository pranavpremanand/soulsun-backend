// backend/models/Analytics.js
const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema(
  {
    source: String,
    medium: String,
    campaign: String,
    path: String,
    timestamp: Date,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Analytics", analyticsSchema);
