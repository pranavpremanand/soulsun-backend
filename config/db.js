const mongoose = require("mongoose");
const dotenv = require("dotenv");


dotenv.config();
let isConnected = 0; // Track connection status: 0 = disconnected, 1 = connected

const connectToDatabase = async () => {
  if (isConnected) {
    console.log("Using existing database connection");
    return;
  }

  try {
    // Connect to the database
    const db = await mongoose.connect(process.env.MONGO_URI);

    isConnected = db.connections[0].readyState; // Set connection status
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    throw new Error("Database connection failed");
  }
};

module.exports = connectToDatabase;
