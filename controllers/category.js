const Category = require("../models/category");

const addCategory = async (req, res) => {
  const { name } = req.body;
  try {
    const newCategory = new Category({
      name,
    });
    await newCategory.save();
    res
      .status(201)
      .json({ message: "Category added successfully", category: newCategory });
  } catch (error) {
    res.status(500).json({ message: "Error adding category", error });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    // console.log(categories);
    res.status(200).json({ categories });
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories", error });
  }
};

module.exports = { addCategory, getAllCategories };
