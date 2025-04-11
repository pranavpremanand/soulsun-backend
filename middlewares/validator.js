const { z } = require("zod");
const profileSchema = z.object({
  fullName: z.string("must be a string").min(1, "Full name is required"),
  address: z.string("must be a string").optional().nullable(),
  city: z.string("must be a string").optional().nullable(),
  state: z.string("must be a string").optional().nullable(),
  phoneNumber: z.string().regex(/^\+?[0-9]+$/, "Invalid phone number"),
  postalCode: z.string("must be a string").optional().nullable(),
  country: z.string("must be a string").optional().nullable(),
  dob: z.string("must be a string").optional().nullable(),
});
const productSchema = z.object({
  _id: z.string().nonempty("Product ID is required."),
  quantity: z.number().min(1, "Quantity must be at least 1."),
  price: z.number().min(0, "Price must be a positive value."),
  name: z.string().min(1, "Product Name is required."),
  images: z.array(z.string().nonempty("At least one image is required.")),
});

const shippingSchema = z.object({
  fullName: z.string().min(1, "Full name is required."),
  phoneNumber: z
    .string()
    .regex(/^[1-9]\d{9}$/, "Phone number must be a valid 10-digit number."),
  address: z.string().min(1, "Address is required."),
  city: z.string().min(1, "City is required."),
  state: z.string().min(1, "State is required."),
  postalCode: z
    .string()
    .regex(/^\d{6}$/, "Postal code must be a valid 6-digit number."),
  // landmark: z.string().min(1, "Landmark is required."),
  products: z.array(productSchema).min(1, "At least one product is required."),
});
const shippingStatusSchema = z.object({
  id: z.string().nonempty("Product ID is required."),
  status: z
    .boolean()
    .refine((val) => typeof val === "boolean", "Status must be a boolean."),
});

const createCouponSchema = z
  .object({
    code: z
      .string()
      .min(3, "Coupon code must be at least 3 characters long")
      .max(20, "Coupon code must be at most 20 characters")
      .trim(),

    description: z.string().optional(), // Description is optional

    discountType: z.enum(["percentage", "fixed"], {
      errorMap: () => ({
        message: "Discount type must be either 'percentage' or 'fixed'",
      }),
    }),

    // Adding discountValue validation only if discountType is "fixed"
    discountValue: z.number().min(1, "Discount value must be greater than 0"),

    usageLimit: z
      .number()
      .positive("Usage Limit must be a positive number")
      .default(1),

    usageLimitPerUser: z
      .number()
      .positive("Usage Limit Per User must be a positive number")
      .default(1),

    minimumAmount: z
      .number()
      .min(0, "Minimum order amount should be at least 0"),

    expiryDate: z
      .string()
      .refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid expiry date format",
      }),
  })
  .refine((data) => new Date(data.expiryDate) > new Date(), {
    message: "Expiry date must be in the future",
    path: ["expiryDate"],
  });

module.exports = {
  profileSchema,
  shippingSchema,
  createCouponSchema,
  shippingStatusSchema,
};
