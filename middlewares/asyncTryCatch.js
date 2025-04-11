const { z } = require("zod");

const asyncCatch = (schema, func) => {
  return async (req, res) => {
    try {
      // Validate the request body if a schema is provided
      // console.log(req.body, 'body')
      if (schema) {
        req.body = schema.parse(req.body); // Overwrite with validated data
      }

      // Execute the provided function
      await func(req, res);
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle validation errors
        return res.status(400).json({ success: false, errors: error.errors });
      }
      console.error("Error:", error);
      // Handle server errors
      return res.status(500).json({ success: false, message: "Server error" });
    }
  };
};

module.exports = asyncCatch;
