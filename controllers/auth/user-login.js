const User = require("../../models/user");
const { BadRequestError, UnauthenticatedError } = require("../../errors");
const { StatusCodes } = require("http-status-codes");
const { loginSchema } = require("../../validation/auth-validation");

const login = async (req, res, next) => {
  const { email, password } = req.body;

  const missingFields = [!email, !password].filter(Boolean).length;

  if (missingFields === 2) {
    return res.status(400).json({
      success: false,
      message: "Please provide email and password",
    });
  }

  const { error } = loginSchema.validate({ email, password });

  if (error) {
    throw new BadRequestError(error.details[0].message);
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw new UnauthenticatedError("Invalid Credentials");
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      throw new UnauthenticatedError("Password in incorrect");
    }

    const token = user.createJWT();
    res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = login;
