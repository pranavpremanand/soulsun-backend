// seedProducts.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/product");
const Category = require("./models/category");

dotenv.config();

const products = [
  {
    name: "Ethereal Moonstone Pendant",
    price: 3499,
    description:
      "Discover the timeless beauty of the Ethereal Moonstone Pendant, a piece designed to captivate and inspire. At its core is a radiant moonstone, celebrated for its magical glow and symbolic connection to harmony and balance. The pendant’s sterling silver setting is meticulously handcrafted with delicate filigree details, giving it an elegant, vintage-inspired charm. Suspended from a sleek silver chain, this pendant is as versatile as it is stunning, effortlessly complementing both casual and formal attire. Its adjustable clasp ensures a perfect fit, making it suitable for every occasion. Whether you’re treating yourself or gifting it to a loved one, the Ethereal Moonstone Pendant is a piece that tells a story.",
    bestSeller: true,
    category: "Pendants",
    keywords: ["moonstone", "pendant", "silver", "elegant"],
  },
  {
    name: "Celestial Harmony Necklace",
    price: 4250,
    description:
      "The Celestial Harmony Necklace captures the serene beauty of the night sky with its stunning crescent moon and star design. This thoughtfully crafted piece symbolizes unity and balance, making it more than just an accessory—it’s a meaningful addition to your jewelry collection. Made from premium sterling silver, the pendant is accented with sparkling cubic zirconia stones, giving it a delicate shimmer. The adjustable chain ensures it can be styled to suit any neckline, whether for a casual outing or a formal event. Presented in our signature SoulSun gift box, this necklace is a perfect choice for anyone seeking elegance with a touch of symbolism.",
    bestSeller: true,
    category: "Necklaces",
    keywords: ["necklace", "crescent moon", "silver", "elegant"],
  },
  {
    name: "Aurora Dusk Earrings",
    price: 2999,
    description:
      "Radiate confidence with the Aurora Dusk Earrings, a breathtaking combination of craftsmanship and style. These earrings feature a blend of gold-plated accents and dazzling crystals, reminiscent of twilight's golden hues. Their intricate yet subtle design makes them versatile, adding a touch of glamour to both casual and evening looks. Designed with comfort in mind, these lightweight earrings are perfect for all-day wear, with secure clasps ensuring they stay in place. Whether for a festive celebration or a romantic dinner, the Aurora Dusk Earrings are sure to make you shine. Packaged in our elegant SoulSun gift box, they also make a thoughtful gift for someone special.",
    bestSeller: true,
    category: "Earrings",
    keywords: ["earrings", "gold-plated", "crystals", "glamour"],
  },
];
exports.products = products;
const categories = [
  { name: "earrings" },
  { name: "necklaces" },
  { name: "rings" },
];
exports.categories = categories;
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log("Connected to MongoDB. Seeding products...");
    await Product.deleteMany(); // Clear old data
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
    const updatedProducts = products.map((product) => ({
      ...product,
      category: categoryMap[product.category]
    }));
    await Product.insertMany(updatedProducts);
    console.log("Products seeded successfully.");
    process.exit();
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB or seeding products:", error);
    process.exit(1);
  });
