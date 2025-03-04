// controllers/wishlistController.js
const Wishlist = require("../models/wishlist");

// Add product to wishlist
const addToWishlist = async (req, res) => {
  const { productId } = req.body;

  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) {
      const newWishlist = new Wishlist({ user: req.user.id, products: [productId] });
      await newWishlist.save();
      return res.status(201).json({ message: "Product added to wishlist", wishlist: newWishlist });
    }

    if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
      await wishlist.save();
      res.status(200).json({ message: "Product added to wishlist", wishlist });
    }else{
      wishlist.products = wishlist.products.filter((key) => key.toString() !== productId);
      await wishlist.save();
      res.status(200).json({ message: "Product removed from wishlist", wishlist });
    }
  } catch (error) {
    res.status(500).json({ message: "Error adding to wishlist", error });
  }
};

// Get wishlist
const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id }).populate("products");
    res.status(200).json({ wishlist });
  } catch (error) {
    res.status(500).json({ message: "Error fetching wishlist", error });
  }
};

module.exports = { addToWishlist, getWishlist };
