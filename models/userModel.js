import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: String,
  password: {
    type: String,
    select: false,
  },
  lastName: {
    type: String,
    default: "lastName",
  },
  location: {
    type: String,
    default: "my city",
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  avatar: String,
  avatarPublicId: String,
});

export default mongoose.model("User", userSchema);
