const mongoose = require("mongoose");
const Product = require("./models/product");
const Category = require("./models/category")
const dotenv = require("dotenv");
const User = require("./models/User");
const bcrypt = require("bcryptjs");

dotenv.config();
const necklaceItems = [
    {
      name: "Orbit Triple Hoops",
      price: 2500,
      description: "Throughout time humans have looked to the stars for inspiration. Handcrafted in bronze, plated in a choice of 22k Gold or Silver Rhodium, the Sirena Hoops are inspired by the creatures of the sea, an elevated representation of how distant constellations and the cosmos can find form in sculpture. ",
      Category: "earrings",
      images: ["/public/images/earrings-1/1-1.jpg", "/public/images/necklaces-1/1-2.jpg"],
      bestSeller: true,
    },
    {
      name: "Chunky Chain Hoops",
      price: 2500,
      description: "Throughout time humans have looked to the stars for inspiration. Handcrafted in bronze, plated in a choice of 22k Gold or Silver Rhodium, the Sirena Hoops are inspired by the creatures of the sea, an elevated representation of how distant constellations and the cosmos can find form in sculpture. ",
      Category: "necklaces",
      images: ["/public/images/necklaces-1/2-1.jpg", "/public/images/necklaces-1/2-2.jpg"],
      bestSeller: true,
    },
    {
      name: "Chunky Chain Hoops",
      price: 2500,
      description: "Throughout time humans have looked to the stars for inspiration. Handcrafted in bronze, plated in a choice of 22k Gold or Silver Rhodium, the Sirena Hoops are inspired by the creatures of the sea, an elevated representation of how distant constellations and the cosmos can find form in sculpture. ",
      Category: "necklaces",
      images: ["/public/images/necklaces-1/3-1.jpg", "/public/images/necklaces-1/3-2.jpg"],
      bestSeller: true,
    },
    {
      name: "Chunky Chain Hoops",
      price: 2500,
      description: "Throughout time humans have looked to the stars for inspiration. Handcrafted in bronze, plated in a choice of 22k Gold or Silver Rhodium, the Sirena Hoops are inspired by the creatures of the sea, an elevated representation of how distant constellations and the cosmos can find form in sculpture. ",
      Category: "necklaces",
      images: ["/public/images/necklaces-1/4-1.jpg", "/public/images/necklaces-1/4-2.jpg"],
      bestSeller: true,
    },
    {
      name: "Chunky Chain Hoops",
      price: 2500,
      description: "Throughout time humans have looked to the stars for inspiration. Handcrafted in bronze, plated in a choice of 22k Gold or Silver Rhodium, the Sirena Hoops are inspired by the creatures of the sea, an elevated representation of how distant constellations and the cosmos can find form in sculpture. ",
      Category: "necklaces",
      images: ["/public/images/necklaces-1/5-1.jpg", "/public/images/necklaces-1/5-2.jpg"],
      bestSeller: false,
    },
    {
      name: "Chunky Chain Hoops",
      price: 2500,
      description: "Throughout time humans have looked to the stars for inspiration. Handcrafted in bronze, plated in a choice of 22k Gold or Silver Rhodium, the Sirena Hoops are inspired by the creatures of the sea, an elevated representation of how distant constellations and the cosmos can find form in sculpture. ",
      Category: "necklaces",
      images: ["/public/images/necklaces-1/6-1.jpg", "/public/images/necklaces-1/6-2.jpg"],
      bestSeller: false,
    },
    {
      name: "Chunky Chain Hoops",
      price: 2500,
      description: "Throughout time humans have looked to the stars for inspiration. Handcrafted in bronze, plated in a choice of 22k Gold or Silver Rhodium, the Sirena Hoops are inspired by the creatures of the sea, an elevated representation of how distant constellations and the cosmos can find form in sculpture. ",
      Category: "necklaces",
      images: ["/public/images/necklaces-1/7-1.jpg", "/public/images/necklaces-1/7-2.jpg"],
      bestSeller: false,
    },
    {
      name: "Chunky Chain Hoops",
      price: 2500,
      description: "Throughout time humans have looked to the stars for inspiration. Handcrafted in bronze, plated in a choice of 22k Gold or Silver Rhodium, the Sirena Hoops are inspired by the creatures of the sea, an elevated representation of how distant constellations and the cosmos can find form in sculpture. ",
      Category: "necklaces",
      images: ["/public/images/necklaces-1/8-1.jpg", "/public/images/necklaces-1/8-2.jpg"],
      bestSeller: false,
    },
    {
      name: "Chunky Chain Hoops",
      price: 2500,
      description: "Throughout time humans have looked to the stars for inspiration. Handcrafted in bronze, plated in a choice of 22k Gold or Silver Rhodium, the Sirena Hoops are inspired by the creatures of the sea, an elevated representation of how distant constellations and the cosmos can find form in sculpture. ",
      Category: "necklaces",
      images: ["/public/images/necklaces-1/9-1.jpg", "/public/images/necklaces-1/9-2.jpg"],
      bestSeller: false,
    },
    {
      name: "Chunky Chain Hoops",
      price: 2500,
      description: "Throughout time humans have looked to the stars for inspiration. Handcrafted in bronze, plated in a choice of 22k Gold or Silver Rhodium, the Sirena Hoops are inspired by the creatures of the sea, an elevated representation of how distant constellations and the cosmos can find form in sculpture. ",
      Category: "necklaces",
      images: ["/public/images/necklaces-1/10-1.jpg", "/public/images/necklaces-1/10-2.jpg"],
      bestSeller: false,
    },
    {
      name: "Chunky Chain Hoops",
      price: 2500,
      description: "Throughout time humans have looked to the stars for inspiration. Handcrafted in bronze, plated in a choice of 22k Gold or Silver Rhodium, the Sirena Hoops are inspired by the creatures of the sea, an elevated representation of how distant constellations and the cosmos can find form in sculpture. ",
      Category: "necklaces",
      images: ["/public/images/necklaces-1/11-1.jpg", "/public/images/necklaces-1/11-2.jpg"],
      bestSeller: false,
    },
  ];
  
  
  // earrings
const earringsItems = [
    {
      name: "Orbit Triple Hoops",
      price: 2500,
      description: "Throughout time humans have looked to the stars for inspiration. Handcrafted in bronze, plated in a choice of 22k Gold or Silver Rhodium, the Sirena Hoops are inspired by the creatures of the sea, an elevated representation of how distant constellations and the cosmos can find form in sculpture.",
      Category: "earrings",
      images: ["/public/images/earrings-1/1-1.jpg", "/public/images/earrings-1/1-2.jpg"],
      bestSeller: true,
    },
    {
      name: "Orbit Triple Hoops",
      price: 2500,
      description: "Throughout time humans have looked to the stars for inspiration. Handcrafted in bronze, plated in a choice of 22k Gold or Silver Rhodium, the Sirena Hoops are inspired by the creatures of the sea, an elevated representation of how distant constellations and the cosmos can find form in sculpture.",
      Category: "earrings",
      images: ["/public/images/earrings-1/2-1.jpg", "/public/images/earrings-1/2-2.jpg"],
      bestSeller: false,
    },
    {
      name: "Orbit Triple Hoops",
      price: 2500,
      description: "Throughout time humans have looked to the stars for inspiration. Handcrafted in bronze, plated in a choice of 22k Gold or Silver Rhodium, the Sirena Hoops are inspired by the creatures of the sea, an elevated representation of how distant constellations and the cosmos can find form in sculpture.",
      Category: "earrings",
      images: ["/public/images/earrings-1/3-1.jpg", "/public/images/earrings-1/3-2.jpg"],
      bestSeller: true,
    },
    {
      name: "Orbit Triple Hoops",
      price: 2500,
      description: "Throughout time humans have looked to the stars for inspiration. Handcrafted in bronze, plated in a choice of 22k Gold or Silver Rhodium, the Sirena Hoops are inspired by the creatures of the sea, an elevated representation of how distant constellations and the cosmos can find form in sculpture.",
      Category: "earrings",
      images: ["/public/images/earrings-1/4-1.jpg", "/public/images/earrings-1/4-2.jpg"],
      bestSeller: false,
    },
    {
      name: "Orbit Triple Hoops",
      price: 2500,
      description: "Throughout time humans have looked to the stars for inspiration. Handcrafted in bronze, plated in a choice of 22k Gold or Silver Rhodium, the Sirena Hoops are inspired by the creatures of the sea, an elevated representation of how distant constellations and the cosmos can find form in sculpture.",
      Category: "earrings",
      images: ["/public/images/earrings-1/5-1.jpg", "/public/images/earrings-1/5-2.jpg"],
      bestSeller: true,
    },
    {
      name: "Orbit Triple Hoops",
      price: 2500,
      description: "Throughout time humans have looked to the stars for inspiration. Handcrafted in bronze, plated in a choice of 22k Gold or Silver Rhodium, the Sirena Hoops are inspired by the creatures of the sea, an elevated representation of how distant constellations and the cosmos can find form in sculpture.",
      Category: "earrings",
      images: ["/public/images/earrings-1/6-1.jpg", "/public/images/earrings-1/6-2.jpg"],
      bestSeller: false,
    },
    {
      name: "Orbit Triple Hoops",
      price: 2500,
      description: "Throughout time humans have looked to the stars for inspiration. Handcrafted in bronze, plated in a choice of 22k Gold or Silver Rhodium, the Sirena Hoops are inspired by the creatures of the sea, an elevated representation of how distant constellations and the cosmos can find form in sculpture.",
      Category: "earrings",
      images: ["/public/images/earrings-1/7-1.jpg", "/public/images/earrings-1/7-2.jpg"],
      bestSeller: true,
    },
    {
      name: "Orbit Triple Hoops",
      price: 2500,
      description: "Throughout time humans have looked to the stars for inspiration. Handcrafted in bronze, plated in a choice of 22k Gold or Silver Rhodium, the Sirena Hoops are inspired by the creatures of the sea, an elevated representation of how distant constellations and the cosmos can find form in sculpture.",
      Category: "earrings",
      images: ["/public/images/earrings-1/8-1.jpg", "/public/images/earrings-1/8-2.jpg"],
      bestSeller: true,
    },
    {
      name: "Orbit Triple Hoops",
      price: 2500,
      description: "Throughout time humans have looked to the stars for inspiration. Handcrafted in bronze, plated in a choice of 22k Gold or Silver Rhodium, the Sirena Hoops are inspired by the creatures of the sea, an elevated representation of how distant constellations and the cosmos can find form in sculpture.",
      Category: "earrings",
      images: ["/public/images/earrings-1/9-1.jpg", "/public/images/earrings-1/9-2.jpg"],
      bestSeller: false,
    },
    {
      name: "Orbit Triple Hoops",
      price: 2500,
      description: "Throughout time humans have looked to the stars for inspiration. Handcrafted in bronze, plated in a choice of 22k Gold or Silver Rhodium, the Sirena Hoops are inspired by the creatures of the sea, an elevated representation of how distant constellations and the cosmos can find form in sculpture.",
      Category: "earrings",
      images: ["/public/images/earrings-1/10-1.jpg", "/public/images/earrings-1/10-2.jpg"],
      bestSeller: true,
    },
    {
      name: "Orbit Triple Hoops",
      price: 2500,
      description: "Throughout time humans have looked to the stars for inspiration. Handcrafted in bronze, plated in a choice of 22k Gold or Silver Rhodium, the Sirena Hoops are inspired by the creatures of the sea, an elevated representation of how distant constellations and the cosmos can find form in sculpture.",
      Category: "earrings",
      images: ["/public/images/earrings-1/11-1.jpg", "/public/images/earrings-1/11-2.jpg"],
      bestSeller: false,
    },
    {
      name: "Orbit Triple Hoops",
      price: 2500,
      description: "Throughout time humans have looked to the stars for inspiration. Handcrafted in bronze, plated in a choice of 22k Gold or Silver Rhodium, the Sirena Hoops are inspired by the creatures of the sea, an elevated representation of how distant constellations and the cosmos can find form in sculpture.",
      Category: "earrings",
      images: ["/public/images/earrings-1/12-1.jpg", "/public/images/earrings-1/12-2.jpg"],
      bestSeller: false,
    },
    {
      name: "Orbit Triple Hoops",
      price: 2500,
      description: "Throughout time humans have looked to the stars for inspiration. Handcrafted in bronze, plated in a choice of 22k Gold or Silver Rhodium, the Sirena Hoops are inspired by the creatures of the sea, an elevated representation of how distant constellations and the cosmos can find form in sculpture.",
      Category: "earrings",
      images: ["/public/images/earrings-1/13-1.jpg", "/public/images/earrings-1/13-2.jpg"],
      bestSeller: true,
    },
    {
      name: "Orbit Triple Hoops",
      price: 2500,
      description: "Throughout time humans have looked to the stars for inspiration. Handcrafted in bronze, plated in a choice of 22k Gold or Silver Rhodium, the Sirena Hoops are inspired by the creatures of the sea, an elevated representation of how distant constellations and the cosmos can find form in sculpture.",
      Category: "earrings",
      images: ["/public/images/earrings-1/14-1.jpg", "/public/images/earrings-1/14-2.jpg"],
      bestSeller: false,
    },
    {
      name: "Orbit Triple Hoops",
      price: 2500,
      description: "Throughout time humans have looked to the stars for inspiration. Handcrafted in bronze, plated in a choice of 22k Gold or Silver Rhodium, the Sirena Hoops are inspired by the creatures of the sea, an elevated representation of how distant constellations and the cosmos can find form in sculpture.",
      Category: "earrings",
      images: ["/public/images/earrings-1/15-1.jpg", "/public/images/earrings-1/15-2.jpg"],
      bestSeller: false,
    },
    {
      name: "Orbit Triple Hoops",
      price: 2500,
      description: "Throughout time humans have looked to the stars for inspiration. Handcrafted in bronze, plated in a choice of 22k Gold or Silver Rhodium, the Sirena Hoops are inspired by the creatures of the sea, an elevated representation of how distant constellations and the cosmos can find form in sculpture.",
      Category: "earrings",
      images: ["/public/images/earrings-1/16-1.jpg", "/public/images/earrings-1/16-2.jpg"],
      bestSeller: false,
    },
    {
      name: "Orbit Triple Hoops",
      price: 2500,
      description: "Throughout time humans have looked to the stars for inspiration. Handcrafted in bronze, plated in a choice of 22k Gold or Silver Rhodium, the Sirena Hoops are inspired by the creatures of the sea, an elevated representation of how distant constellations and the cosmos can find form in sculpture.",
      Category: "earrings",
      images: ["/public/images/earrings-1/17-1.jpg", "/public/images/earrings-1/17-2.jpg"],
      bestSeller: false,
    },
    {
      name: "Orbit Triple Hoops",
      price: 2500,
      description: "Throughout time humans have looked to the stars for inspiration. Handcrafted in bronze, plated in a choice of 22k Gold or Silver Rhodium, the Sirena Hoops are inspired by the creatures of the sea, an elevated representation of how distant constellations and the cosmos can find form in sculpture.",
      Category: "earrings",
      images: ["/public/images/earrings-1/18-1.jpg", "/public/images/earrings-1/18-2.jpg"],
      bestSeller: false,
    },
    {
      name: "Orbit Triple Hoops",
      price: 2500,
      description: "Throughout time humans have looked to the stars for inspiration. Handcrafted in bronze, plated in a choice of 22k Gold or Silver Rhodium, the Sirena Hoops are inspired by the creatures of the sea, an elevated representation of how distant constellations and the cosmos can find form in sculpture.",
      Category: "earrings",
      images: ["/public/images/earrings-1/19-1.jpg", "/public/images/earrings-1/19-2.jpg"],
      bestSeller: true,
    },
    {
      name: "Orbit Triple Hoops",
      price: 2500,
      description: "Throughout time humans have looked to the stars for inspiration. Handcrafted in bronze, plated in a choice of 22k Gold or Silver Rhodium, the Sirena Hoops are inspired by the creatures of the sea, an elevated representation of how distant constellations and the cosmos can find form in sculpture.",
      Category: "earrings",
      images: ["/public/images/earrings-1/20-1.jpg", "/public/images/earrings-1/20-1.jpg"],
      bestSeller: false,
    },
    {
      name: "Orbit Triple Hoops",
      price: 2500,
      description: "Throughout time humans have looked to the stars for inspiration. Handcrafted in bronze, plated in a choice of 22k Gold or Silver Rhodium, the Sirena Hoops are inspired by the creatures of the sea, an elevated representation of how distant constellations and the cosmos can find form in sculpture.",
      Category: "earrings",
      images: ["/public/images/earrings-1/21-1.jpg", "/public/images/earrings-1/21-2.jpg"],
      bestSeller: false,
    },
    {
      name: "Orbit Triple Hoops",
      price: 2500,
      description: "Throughout time humans have looked to the stars for inspiration. Handcrafted in bronze, plated in a choice of 22k Gold or Silver Rhodium, the Sirena Hoops are inspired by the creatures of the sea, an elevated representation of how distant constellations and the cosmos can find form in sculpture.",
      Category: "earrings",
      images: ["/public/images/earrings-1/22-1.jpg", "/public/images/earrings-1/22-2.jpg"],
      bestSeller: false,
    },
  ];
  
  // rings
const ringsItems = [
    {
      id: 1,
      name: "Stackable Pebble Rings",
      price: 2500,
      description: "Throughout time humans have looked to the stars for inspiration. Handcrafted in bronze, plated in a choice of 22k Gold or Silver Rhodium, the Sirena Hoops are inspired by the creatures of the sea, an elevated representation of how distant constellations and the cosmos can find form in sculpture.",
      Category: "rings",
      images: ["/public/images/rings-1/1-1.jpg", "/public/images/rings-1/1-2.jpg"],
      bestSeller: true,
    },
    {
      id: 2,
      name: "Stackable Pebble Rings",
      price: 2500,
      description: "Throughout time humans have looked to the stars for inspiration. Handcrafted in bronze, plated in a choice of 22k Gold or Silver Rhodium, the Sirena Hoops are inspired by the creatures of the sea, an elevated representation of how distant constellations and the cosmos can find form in sculpture.",
      Category: "rings",
      images: ["/public/images/rings-1/2-1.jpg", "/public/images/rings-1/2-2.jpg"],
      bestSeller: false,
    },
    {
      id: 3,
      name: "Stackable Pebble Rings",
      price: 2500,
      description: "Throughout time humans have looked to the stars for inspiration. Handcrafted in bronze, plated in a choice of 22k Gold or Silver Rhodium, the Sirena Hoops are inspired by the creatures of the sea, an elevated representation of how distant constellations and the cosmos can find form in sculpture.",
      Category: "rings",
      images: ["/public/images/rings-1/3-1.jpg", "/public/images/rings-1/3-2.jpg"],
      bestSeller: true,
    },
    {
      id: 4,
      name: "Stackable Pebble Rings",
      price: 2500,
      description: "Throughout time humans have looked to the stars for inspiration. Handcrafted in bronze, plated in a choice of 22k Gold or Silver Rhodium, the Sirena Hoops are inspired by the creatures of the sea, an elevated representation of how distant constellations and the cosmos can find form in sculpture.",
      Category: "rings",
      images: ["/public/images/rings-1/4-1.jpg", "/public/images/rings-1/4-2.jpg"],
      bestSeller: false,
    },
    {
      id: 5,
      name: "Stackable Pebble Rings",
      price: 2500,
      description: "Throughout time humans have looked to the stars for inspiration. Handcrafted in bronze, plated in a choice of 22k Gold or Silver Rhodium, the Sirena Hoops are inspired by the creatures of the sea, an elevated representation of how distant constellations and the cosmos can find form in sculpture.",
      Category: "rings",
      images: ["/public/images/rings-1/5-1.jpg", "/public/images/rings-1/5-2.jpg"],
      bestSeller: false,
    },
    {
      id: 6,
      name: "Stackable Pebble Rings",
      price: 2500,
      description: "Throughout time humans have looked to the stars for inspiration. Handcrafted in bronze, plated in a choice of 22k Gold or Silver Rhodium, the Sirena Hoops are inspired by the creatures of the sea, an elevated representation of how distant constellations and the cosmos can find form in sculpture.",
      Category: "rings",
      images: ["/public/images/rings-1/6-1.jpg", "/public/images/rings-1/6-2.jpg"],
      bestSeller: true,
    },
    {
      id: 7,
      name: "Stackable Pebble Rings",
      price: 2500,
      description: "Throughout time humans have looked to the stars for inspiration. Handcrafted in bronze, plated in a choice of 22k Gold or Silver Rhodium, the Sirena Hoops are inspired by the creatures of the sea, an elevated representation of how distant constellations and the cosmos can find form in sculpture.",
      Category: "rings",
      images: ["/public/images/rings-1/7-1.jpg", "/public/images/rings-1/7-2.jpg"],
      bestSeller: false,
    },
    {
      id: 8,
      name: "Stackable Pebble Rings",
      price: 2500,
      description: "Throughout time humans have looked to the stars for inspiration. Handcrafted in bronze, plated in a choice of 22k Gold or Silver Rhodium, the Sirena Hoops are inspired by the creatures of the sea, an elevated representation of how distant constellations and the cosmos can find form in sculpture.",
      Category: "rings",
      images: ["/public/images/rings-1/8-1.jpg", "/public/images/rings-1/8-2.jpg"],
      bestSeller: false,
    },
    {
      id: 9,
      name: "Stackable Pebble Rings",
      price: 2500,
      description: "Throughout time humans have looked to the stars for inspiration. Handcrafted in bronze, plated in a choice of 22k Gold or Silver Rhodium, the Sirena Hoops are inspired by the creatures of the sea, an elevated representation of how distant constellations and the cosmos can find form in sculpture.",
      Category: "rings",
      images: ["/public/images/rings-1/9-1.jpg", "/public/images/rings-1/9-2.jpg"],
      bestSeller: true,
    },
    {
      id: 10,
      name: "Stackable Pebble Rings",
      price: 2500,
      description: "Throughout time humans have looked to the stars for inspiration. Handcrafted in bronze, plated in a choice of 22k Gold or Silver Rhodium, the Sirena Hoops are inspired by the creatures of the sea, an elevated representation of how distant constellations and the cosmos can find form in sculpture.",
      Category: "rings",
      images: ["/public/images/rings-1/10-1.jpg", "/public/images/rings-1/10-2.jpg"],
      bestSeller: false,
    },
  ];
  
const categories = [
    { name: "earrings" },
    { name: "necklaces" },
    { name: "rings" },
  ];
  // Combine all product data
const allProducts = [
    ...necklaceItems,
    ...earringsItems,
    ...ringsItems,
  ];
  // Admin User Data
const adminData = {
  name: "Admin",
  email: "admin@soulsun.com",
  password: "admin123", // Change this to a strong password
  role: "admin"
};
  // Seed function
const seedProducts = async () => {
    try {
      // Connect to the database
      await mongoose.connect(process.env.MONGO_URI);
  
      // Clear the Product collection
      await Product.deleteMany({});
      console.log("Cleared existing products");
      await Category.deleteMany(); // Clear old data
    // Insert categories
    const insertedCategories = await Category.insertMany(categories);
    console.log("Categories seeded successfully.");

    // Map category names to ObjectIds
    const categoryMap = {};
    insertedCategories.forEach((cat) => {
      categoryMap[cat.name] = cat._id;
    });
    console.log(categoryMap)
    // Replace category names in products with ObjectIds
    const updatedProducts = allProducts.map((product) => ({
      ...product,
      Category: categoryMap[product.Category]
    }));
      // Insert new product data
      await Product.insertMany(updatedProducts);
      console.log("Inserted product data successfully!");
          // Check if admin already exists
          const existingAdmin = await User.findOne({ email: adminData.email });

          if (existingAdmin) {
              console.log("Admin already exists.");
          } else {
              // Hash Password
              adminData.password = await bcrypt.hash(adminData.password, 10);
  
              // Create Admin User
              const admin = new User(adminData);
              await admin.save();
  
              console.log("Admin user created successfully.");
          }
      // Disconnect from the database
      mongoose.connection.close();
    } catch (err) {
      console.error("Error seeding data:", err);
      mongoose.connection.close();
    }
  };

module.exports = {seedProducts, allProducts, categories, adminData}