// const mongoose = require("mongoose");
const seedProducts = require("./initProducts"); // Update with the correct path

const runSeeder = async () => {
  try {
    await seedProducts();
    console.log("Seeding completed successfully!");
    process.exit(0); // Exit successfully
  } catch (err) {
    console.error("Error during seeding:", err);
    process.exit(1); // Exit with failure
  }
};

runSeeder();