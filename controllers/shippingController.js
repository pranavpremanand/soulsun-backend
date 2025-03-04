// controllers/shippingController.js
const asyncCatch = require("../middlewares/asyncTryCatch");
const { shippingSchema, shippingStatusSchema } = require("../middlewares/validator");
const Shipping = require("../models/shipping");

// Add shipping information
const addShipping = asyncCatch(shippingSchema, async (req, res) => {
  const {
    fullName,
    phoneNumber,
    address,
    city,
    state,
    postalCode,
    landmark,
    products,
  } = req.body;

  // Calculate total price
  const totalPrice = products.reduce((sum, product) => {
    if (!product._id || !product.quantity || !product.price) {
      throw new Error(
        "Each product must have product ID, quantity, and price."
      );
    }
    return sum + product.quantity * product.price;
  }, 0);
  // Create shipping document
  const shipping = new Shipping({
    user: req.user.id,
    fullName,
    phoneNumber,
    address,
    city,
    state,
    postalCode,
    landmark,
    products,
    totalPrice,
  });
  await shipping.save();
  res.status(201).json({ message: "Shipping details added", shipping });
});

//Get shipping by user id
const getShippingByUserId = async (req, res) => {
  try {
    // Fetch all shipping details for the user
    const shippings = await Shipping.find({ user: req.user.id });

    if (!shippings || shippings.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "No shipping details found for this user." 
      });
    }

    res.status(200).json({
      success: true,
      message: "Shipping details retrieved successfully.",
      orders: shippings,
    });
  } catch (error) {
    console.error("Error fetching shipping details:", error.message);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching shipping details.",
      error: error.message,
    });
  }
};
const getAllOrdersList = async (req, res) => {
  try {
    // Extract page and limit from query parameters (set defaults if not provided)
    let { page = 1, limit = 10 } = req.query;

    // Convert page and limit to integers
    page = parseInt(page);
    limit = parseInt(limit);

    // Calculate the number of documents to skip
    const skip = (page - 1) * limit;

    // Fetch shipping orders with pagination
    const list = await Shipping.find()
      .populate("user")
      .skip(skip)
      .limit(limit)
      .exec();

    // Get the total count of documents
    const totalOrders = await Shipping.countDocuments();

    // Send a response with pagination metadata
    res.status(200).json({
      success: true,
      message: "Shipping details fetched successfully.",
      data: list,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalOrders / limit),
        totalOrders,
        hasNextPage: skip + list.length < totalOrders,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    // If an error occurs, send an error response
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching shipping details.",
      error: error.message,
    });
  }
};


const getStats = async(req, res) => {
  try {
    const totalOrders = await Shipping.countDocuments();
    const totalSales = await Shipping.aggregate([
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);
    const totalPurchasedItems = await Shipping.aggregate([
      { $unwind: "$products" },
      { $group: { _id: null, total: { $sum: "$products.quantity" } } },
    ]);
    const deliveredOrders = await Shipping.countDocuments({ isDelivered: true });

    res.json({
      totalOrders,
      totalSales: totalSales[0]?.total || 0,
      totalPurchasedItems: totalPurchasedItems[0]?.total || 0,
      deliveredOrders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
const getSalesReport = async (req, res) => {
  const { range } = req.params;
  
  const date = new Date();
  let startDate;

  // Determine the start date based on the range
  if (range === "12") {
    startDate = new Date(date.setMonth(date.getMonth() - 12));
  } else if (range === "6") {
    startDate = new Date(date.setMonth(date.getMonth() - 6));
  } else if (range === "30d") {
    startDate = new Date(date.setDate(date.getDate() - 30));
  } else if (range === "7d") {
    startDate = new Date(date.setDate(date.getDate() - 7));
  } else {
    startDate = new Date(date.setMonth(date.getMonth() - 1));
  }

  try {
    const formatString =
      range === "12" || range === "6" || range === "3"
        ? "%m" // Fix: Use "%m-%Y" instead of "%y"
        : "%d"; // Fix for day range: Use "%d-%m-%Y"

    const salesData = await Shipping.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(startDate),
            $lte: new Date(),
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: formatString, date: "$createdAt" } }, // ✅ Fix applied
          totalSales: { $sum: "$totalPrice" },
          totalOrders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return res.status(200).json({
      success: true,
      message: "Shipping details fetched successfully.",
      data: salesData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching shipping details.",
      error: error.message,
    });
  }
};


const updateShippingStatus = asyncCatch(shippingStatusSchema, async(req, res)=>{
  const {id, status} = req.body

  const shipping = await Shipping.findOne({ _id: id });
  if (!shipping ) {
    return res.status(404).json({ 
      success: false, 
      message: "No shipping details found for this id." 
    });
  }

  shipping.isDelivered =status

  await shipping.save()
  res.status(200).json({
    success: true,
    message: "Shipping details updated successfully.",
  });
  
})

module.exports = { addShipping, getShippingByUserId, getSalesReport, getAllOrdersList , updateShippingStatus, getStats};
