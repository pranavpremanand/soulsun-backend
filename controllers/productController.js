// controllers/productController.js

const Category = require("../models/category");
const Product = require("../models/product");
const multer = require("multer");
// const { put } = require("@vercel/blob");
const cloudinary = require("../utils/cloudinary");
const mongoose = require("mongoose");
const ProductView = require("../models/ProductView");
// const dotenv = require("dotenv");

// dotenv.config();
// Configure multer to store files in the 'public/images' folder
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/images'); // Destination folder
//   },
//   filename: (req, file, cb) => {
//     const uniqueName = `${Date.now()}-${file.originalname}`;
//     cb(null, uniqueName); // Using timestamp and original filename for unique name
//   }
// });

// const upload = multer({ storage });

// Multer setup for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage }); // Initialize multer correctly

// Upload images to Cloudinary
const uploadImageToCloudinary = async (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "products" }, // Uploads to "products" folder
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
};
// Function to add a new product
const addProduct = async (req, res) => {
  const {
    name,
    price,
    description,
    Category: categoryName,
    isBestSeller = false,
  } = req.body;
  const categoryFound = await Category.findOne({ name: categoryName });
  // Ensure a file is uploaded

  // Ensure that images are uploaded
  if (!req.files || req.files.length !== 2) {
    return res.status(400).json({ message: "Two image files are required" });
  }
  // Check if category was found
  if (!categoryFound) {
    return res.status(404).json({ message: "Category not found" });
  }
  // Prepare the image paths (relative to public folder)
  // const imagePaths = req.files.map(file => `/public/images/${file.filename}`);

  // Upload images to Vercel Blob
  // const imageUrls = await Promise.all(
  //   req.files.map(async (file) => {
  //     const blob = await put(`products/${Date.now()}-${file.originalname}`, file.buffer, {
  //       access: "public",
  //       // token:process.env.VERCEL_BLOB_READ_WRITE_TOKEN
  //     });
  //     return blob.url; // Save the public URL
  //   })
  // );

  // Upload images to Cloudinary
  const imageUrls = await Promise.all(
    req.files.map((file) => uploadImageToCloudinary(file.buffer))
  );
  try {
    const newProduct = new Product({
      name,
      price,
      description,
      Category: categoryFound._id,
      images: imageUrls,
      isBestSeller,
    });
    await newProduct.save();
    res
      .status(201)
      .json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    res.status(500).json({ message: "Error adding product", error });
  }
};
const updateProduct = async (req, res) => {
  const {
    name,
    price,
    description,
    Category: categoryName,
    isBestSeller = false,
  } = req.body;
  const categoryFound = await Category.findOne({ name: categoryName });

  if (!categoryFound) {
    return res.status(404).json({ message: "Category not found" });
  }

  try {
    const product = await Product.findById(req.params.id);

    // Extract existing images from the product
    const existingImages = product.images || [];

    // Update images if new files are uploaded (if files exist, replace the corresponding images)
    const updatedImages = [...existingImages];

    if (req.files) {
      // for multer
      // req.files.forEach((file, index) => {
      //   // Replace the first image if the user has uploaded a new one for img1
      //   if (index === 0 && updatedImages.length > 0) {
      //     updatedImages[0] = file.path; // Replace the first image
      //   }
      //   // Replace the second image if the user has uploaded a new one for img2
      //   if (index === 1 && updatedImages.length > 1) {
      //     updatedImages[1] = file.path; // Replace the second image
      //   }
      // });

      //for cloudinary
      if (req.files) {
        await Promise.all(
          req.files.map(async (file, index) => {
            if (updatedImages[index]) {
              // **Step 1:** Delete the existing image at the same index
              try {
                const publicId = updatedImages[index]
                  .split("/")
                  .pop()
                  .split(".")[0]; // Extract Cloudinary public ID
                await cloudinary.uploader.destroy(`products/${publicId}`); // Delete from Cloudinary
              } catch (error) {
                console.error(
                  "Error deleting old image from Cloudinary:",
                  error
                );
              }
            }

            // **Step 2:** Upload new image to Cloudinary
            const newImageUrl = await new Promise((resolve, reject) => {
              const uploadStream = cloudinary.uploader.upload_stream(
                { folder: "products" },
                (error, result) => {
                  if (error) {
                    console.error("Cloudinary upload error:", error);
                    reject("Image upload failed");
                  } else {
                    resolve(result.secure_url);
                  }
                }
              );
              uploadStream.end(file.buffer);
            });

            // Replace only the updated image in the array
            updatedImages[index] = newImageUrl;
          })
        );
      }
    }

    // Update product with new or retained images
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        price,
        description,
        Category: categoryFound._id,
        isBestSeller,
        images: updatedImages,
      },
      { new: true }
    );

    res
      .status(200)
      .json({ updatedProduct, message: "Product updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error });
  }
};

// Function to get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ status: true })
      .populate("Category", "name") // This should work if the 'Category' model is correct
      .exec(); // Use .exec() to explicitly return a promise
    Category.find({}, "name") // Find all categories and return only the 'name' field
      .catch((error) => console.log(error));
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
};

// Function to get all products with limit
const getAllProductsWithLimit = async (req, res) => {
  try {
    const products = await Product.find({ status: true })
      .limit(req.params.limit)
      .populate("Category", "name") // This should work if the 'Category' model is correct
      .exec(); // Use .exec() to explicitly return a promise
    Category.find({}, "name") // Find all categories and return only the 'name' field
      .catch((error) => console.log(error));
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
};
const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params; // Extract category from route parameters
    // Find the category by name

    const categoryFound = await Category.findOne({ name: category });
    // Check if category was found
    if (!categoryFound) {
      return res.status(404).json({ message: "Category not found" });
    }
    // Query products based on category
    const products = await Product.find({
      Category: categoryFound._id,
      status: true,
    });
    if (!products.length) {
      return res
        .status(404)
        .json({ message: "No products found in this category" });
    }

    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
};
const changeProductStatus = async (req, res) => {
  const { id } = req.body;
  try {
    // Find the product by ID
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Toggle status (if true, make false; if false, make true)
    product.status = !product.status;

    // Save the updated product
    await product.save();
    res.status(200).json({ message: "Product status updated", product });
  } catch (error) {
    res.status(500).json({ message: "Error on updating products", error });
  }
};
// Function to get a product by ID
const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ product });
  } catch (error) {
    res.status(500).json({ message: "Error fetching product", error });
  }
};

// Function to update a product
// const updateProduct = async (req, res) => {
//   const { id } = req.params;
//   const { name, price, description, category, image, isBestSeller } = req.body;
//   try {
//     const updatedProduct = await Product.findByIdAndUpdate(
//       id,
//       { name, price, description, category, image, isBestSeller },
//       { new: true }
//     );
//     if (!updatedProduct) {
//       return res.status(404).json({ message: "Product not found" });
//     }
//     res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
//   } catch (error) {
//     res.status(500).json({ message: "Error updating product", error });
//   }
// };

// Function to delete a product
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error });
  }
};
// controllers/productController.js
const searchProducts = async (req, res) => {
  try {
    const {
      category,
      name,
      minPrice,
      maxPrice,
      keywords,
      sortBy = "createdAt",
      sortOrder = "desc",
      limit = 10,
      page = 1,
    } = req.query;

    const filters = {};

    // Add category filter
    if (category) {
      filters.category = category;
    }

    // Add name filter (case-insensitive search)
    if (name) {
      filters.name = { $regex: name, $options: "i" }; // `i` makes it case-insensitive
    }

    // Add price range filter
    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.$gte = parseFloat(minPrice);
      if (maxPrice) filters.price.$lte = parseFloat(maxPrice);
    }

    // Add keywords filter
    if (keywords) {
      const keywordArray = keywords.split(",").map((kw) => kw.trim());
      filters.keywords = { $in: keywordArray };
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const products = await Product.find(filters)
      .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Total count for pagination
    const total = await Product.countDocuments(filters);

    res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      products,
    });
  } catch (error) {
    console.error("Error in advancedSearch:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const addView = async (req, res) => {
  const { productId } = req.body;

  try {
    if (!productId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing productId" });
    }

    const viewDoc = await ProductView.findOne({ productId });

    if (viewDoc) {
      viewDoc.views += 1;
      await viewDoc.save();
    } else {
      await ProductView.create({ productId, views: 1 }); // Set initial view
    }

    res.status(200).json({ success: true, message: "View counted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  searchProducts,
  getProductsByCategory,
  changeProductStatus,
  upload,
  getAllProductsWithLimit,
  addView,
};
