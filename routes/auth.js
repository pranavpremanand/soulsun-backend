const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const router = express.Router();

// Register User
router.post("/register", async (req, res) => {
  const {email} = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

     await User.create({ ...req.body });
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Login User
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if(email ==='admin@soulsun.com'){
    return res.status(404).json({ message: "User not found" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id , role: user.role}, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email ,role: user.role}, message: "Log In successfully"  });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});
router.post("/admin/login", async (req, res) => {
  const { email, password } = req.body;
      if(email !=='admin@soulsun.com'){
        return res.status(404).json({ message: "User not found" });
      }
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id , role: user.role}, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email ,role: user.role}, message: "Log In successfully"  });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
