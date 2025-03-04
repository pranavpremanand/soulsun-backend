// routes/product.js
const express = require("express");
const {
  searchProducts,
  getAllProducts,
  getProductsByCategory,
  getProductById,
  changeProductStatus,
  addProduct,
  upload,
  updateProduct,
  getAllProductsWithLimit,
} = require("../controllers/productController");
const router = express.Router();

router.get("/search", searchProducts); // Advanced search route
router.get("/all", getAllProducts); // Advanced search route
router.get("/list/:limit", getAllProductsWithLimit);
router.get("/byCategory/:category", getProductsByCategory); // Advanced search route
router.get("/:id", getProductById); // Advanced search route
router.post("/status", changeProductStatus); // Advanced search route
router.post("/", upload.array("images", 2), addProduct);
router.put("/:id", upload.array("images", 2), updateProduct);

module.exports = router;
