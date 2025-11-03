const User = require("../../models/user");
const { BadRequestError } = require("../../errors");
const { StatusCodes } = require("http-status-codes");
const { registerSchema } = require("../../validation/auth-validation");

const register = async (req, res, next) => {
  const { name, email, password } = req.body;

  const missingFields = [!name, !email, !password].filter(Boolean).length;

  if (missingFields >= 2) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  const { error } = registerSchema.validate({ name, email, password });

  if (error) {
    throw new BadRequestError(error.details[0].message);
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError(
        "User email already exists! Please try with different email"
      );
    }

    const user = await User.create({ ...req.body });
    const token = user.createJWT();
    return res
      .status(StatusCodes.CREATED)
      .json({ user: { name: user.name }, token });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = register;
