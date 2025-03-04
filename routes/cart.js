// routes/cart.js
const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const auth = require('../middleware/auth'); // Assuming you have an auth middleware

// Add item to cart
router.post('/add', auth, async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user._id; // Assuming you have user info in req.user

  try {
    let cart = await Cart.findOne({ userId });

    if (cart) {
      // If cart exists, check if the product is already in the cart
      const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

      if (itemIndex > -1) {
        // Product exists in the cart, update the quantity
        cart.items[itemIndex].quantity += quantity;
      } else {
        // Product does not exist in the cart, add new item
        cart.items.push({ productId, quantity });
      }
    } else {
      // No cart for user, create new cart
      cart = new Cart({
        userId,
        items: [{ productId, quantity }],
      });
    }

    await cart.save();
    res.status(201).send(cart);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;