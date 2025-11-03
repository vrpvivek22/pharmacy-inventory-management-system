const Joi = require("joi");

const addMedicineSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    "string.empty": "Medicine name cannot be empty",
    "string.base": "Medicine name must be a string",
    "any.required": "Medicine Name is required",
  }),
  price: Joi.number().min(1).required().messages({
    "number.base": "Price must be a number",
    "number.min": "Price must be at least 1",
    "any.required": "Price is required",
  }),
  quantity: Joi.number().min(0).required().messages({
    "number.base": "Quantity must be a number",
    "number.min": "Quantity cannot be negative",
    "any.required": "Quantity is required",
  }),
  category: Joi.string()
    .valid("tablet", "syrup", "injection", "capsule", "ointment")
    .required()
    .messages({
      "any.required": "Category is required",
      "any.only":
        "Category must be one of tablet, syrup, injection, capsule or ointment",
    }),
});

const updateMedicineSchema = Joi.object({
  name: Joi.string().trim().messages({
    "string.empty": "Medicine name cannot be empty",
    "string.base": "Medicine name must be a string",
  }),
  price: Joi.number().positive().min(1).messages({
    "number.base": "Price must be a number",
    "number.min": "Price must be at least 1",
  }),
  quantity: Joi.number().positive().min(0).messages({
    "number.base": "Quantity must be a number",
    "number.min": "Quantity cannot be negative",
  }),
  category: Joi.string()
    .valid("tablet", "syrup", "injection", "capsule", "ointment")
    .messages({
      "any.only":
        "Category must be one of tablet, syrup, injection, capsule or ointment",
    }),
  status: Joi.string().valid("in-stock", "out-of-stock", "expired").messages({
    "any.only": "Status must be one of in-stock, out-of-stock or expired",
  }),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided to update the medicine",
  });

module.exports = { addMedicineSchema, updateMedicineSchema };
