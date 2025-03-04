const mongoose = require("mongoose");
const Product = require("../models/product");
const Category = require("../models/category");
const { categories, allProducts, adminData } = require("../initProducts");
const User = require("../models/User");
// const bcrypt = require("bcryptjs");

const checkDBHealth = async (req, res) => {
  try {
    // Get DB connection state
    const dbState = mongoose.connection.readyState;

    // Connection states
    const stateMap = {
      0: "Disconnected",
      1: "Connected",
      2: "Connecting",
      3: "Disconnecting",
    };

    if (dbState === 1) {
      return res
        .status(200)
        .json({ status: "Healthy", dbStatus: stateMap[dbState] });
    } else {
      return res
        .status(500)
        .json({ status: "Unhealthy", dbStatus: stateMap[dbState] });
    }
  } catch (error) {
    return res.status(500).json({ status: "Unhealthy", error: error.message });
  }
};
const resetDB = async (req, res) => {
  try {
    // Drop the entire database (WARNING: This removes all data & collections)
    await mongoose.connection.db.dropDatabase();

    res
      .status(200)
      .json({ status: "Success", message: "Database reset successfully" });
  } catch (error) {
    res.status(500).json({ status: "Error", message: error.message });
  }
};
const seedDB = async (req, res) => {
  try {
    // Clear the Product collection
    await Product.deleteMany({});
    console.log("Cleared existing products");
    await User.deleteMany({});
    console.log("Cleared existing Users.");
    await Category.deleteMany(); // Clear old data
    // Insert categories
    const insertedCategories = await Category.insertMany(categories);
    console.log("Categories seeded successfully.");

    // Map category names to ObjectIds
    const categoryMap = {};
    insertedCategories.forEach((cat) => {
      categoryMap[cat.name] = cat._id;
    });
    // Replace category names in products with ObjectIds
    const updatedProducts = allProducts.map((product) => ({
      ...product,
      Category: categoryMap[product.Category],
    }));
    // Insert new product data
    await Product.insertMany(updatedProducts);
    console.log("Inserted product data successfully!");
    // Check if admin already exists
    // Hash Password
    // adminData.password = await bcrypt.hash(adminData.password, 10);
    // Create Admin User
    const admin = new User(adminData);
    await admin.save();

    console.log("Admin user created successfully.");
    return res.status(200).json({ message: "Database seeded successfully!" });
  } catch (err) {
    console.error("Error during seeding:", err);
    return res
      .status(500)
      .json({ message: "Error during seeding", error: err.message });
  }
};
module.exports = { checkDBHealth, resetDB, seedDB };
