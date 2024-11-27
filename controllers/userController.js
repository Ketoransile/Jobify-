import { StatusCodes } from "http-status-codes";
import User from "../models/userModel.js";
import Job from "../models/jobModel.js";
import { NotFoundError } from "../errors/customErrors.js";
import cloudinary from "cloudinary";
import { formatImage } from "../middleware/multerMiddleware.js";

export const getCurrentUser = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId });
  if (!user) {
    throw new NotFoundError("NO user found with this id");
  }
  res.status(StatusCodes.OK).json({ user });
};
export const getApplicationStats = async (req, res) => {
  const users = await User.countDocuments();
  const jobs = await Job.countDocuments();
  res.status(StatusCodes.OK).json({ users, jobs });
};
export const updateUser = async (req, res) => {
  const newUser = { ...req.body };
  delete newUser.password;

  if (req.file) {
    const file = formatImage(req.file);
    const response = await cloudinary.v2.uploader.upload(file);
    newUser.avatarPublicId = response.publicId;
  }
  const updatedUser = await User.findByIdAndUpdate(req.user.userId, newUser);
  if (req.file && updatedUser.avatarPublicId) {
    await cloudinary.v2.uploader.destroy(updatedUser.avatarPublicId);
  }
  res.status(StatusCodes.OK).json({ msg: "User Updated" });
};
// export const updateUser = async (req, res) => {
//   const newUser = { ...req.body };
//   delete newUser.password;

//   if (req.file) {
//     const response = await cloudinary.v2.uploader.upload(req.file.path);
//     await fs.unlink(req.file.path);
//     newUser.avatar = response.secure_url;
//     newUser.avatarPublicId = response.public_id;
//   }

//   const updatedUser = await User.findByIdAndUpdate(req.body.userId, newUser);
//   if (req.file && updateUser.avatarPublicId) {
//     await cloudinary.v2.uploader.destroy(updateUser.avatartPublicId);
//   }
//   res.status(StatusCodes.OK).json({ msg: "User updated" });
// };
// export const updateUser = async (req, res) => {
//   const newUser = { ...req.body };
//   delete newUser.password;

//   if (req.file) {
//     const response = await cloudinary.v2.uploader.upload(req.file.path);
//     await fs.unlink(req.file.path);
//     newUser.avatar = response.secure_url;
//     newUser.avatarPublicId = response.public_id;
//   }

//   // Check if user exists before proceeding
//   const existingUser = await User.findById(req.body.userId);
//   if (!existingUser) {
//     return res.status(StatusCodes.NOT_FOUND).json({ msg: "User not found" });
//   }

//   const updatedUser = await User.findByIdAndUpdate(req.user.userId, newUser, {
//     new: true,
//   });

//   // Delete old avatar if new one is uploaded and an old avatar exists
//   if (req.file && existingUser.avatarPublicId) {
//     await cloudinary.v2.uploader.destroy(existingUser.avatarPublicId);
//   }

//   res.status(StatusCodes.OK).json({ user: updatedUser, msg: "User updated" });
// };
