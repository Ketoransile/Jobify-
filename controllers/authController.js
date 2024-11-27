import { StatusCodes } from "http-status-codes";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { hashPassword, comparePassword } from "../utils/passwordUtils.js";
import { UnauthenticatedError } from "../errors/customErrors.js";
import { createJWT } from "../utils/tokenUtils.js";

export const register = async (req, res) => {
  const isFirstAccount = (await User.countDocuments()) === 0;
  req.body.role = isFirstAccount ? "admin" : "user";

  const hashedPassword = await hashPassword(req.body.password);
  req.body.password = hashedPassword;

  const user = await User.create(req.body);
  res.status(StatusCodes.CREATED).json({
    message: "User created",
  });
};
export const login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email }).select(
    "+password"
  );
  const isValidUser =
    user && (await comparePassword(req.body.password, user.password));

  if (!isValidUser) throw new UnauthenticatedError("Invalid credentials");

  const token = createJWT({ userId: user._id, role: user.role });
  const oneDay = 1000 * 60 * 60 * 24;
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === "production",
  });
  res.status(StatusCodes.OK).json({ msg: "User logged in" });
};

export const getAllUsers = async (req, res) => {
  const users = await User.find();
  if (!users || users.length === 0) {
    return res.status(StatusCodes.NOT_FOUND).json({
      status: "fail",
      message: "NO users are found on the database",
    });
  }
  res.status(StatusCodes.OK).json({
    status: "success",
    data: { users },
  });
};

export const logout = (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({
    message: "USer logged out",
  });
};
