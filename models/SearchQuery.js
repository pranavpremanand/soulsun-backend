// models/SearchQuery.js

const mongoose = require("mongoose");

const searchQuerySchema = new mongoose.Schema({
  query: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const SearchQuery = mongoose.model("SearchQuery", searchQuerySchema);

module.exports = SearchQuery;
