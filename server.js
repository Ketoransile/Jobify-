import "express-async-errors";
import express from "express";
import morgan from "morgan";
import * as dotenv from "dotenv";
import jobsRoute from "./routes/jobRouter.js";
import mongoose from "mongoose";
import errorHandlerMiddleware from "./middleware/errorHandlerMiddleware.js";
import authRoute from "./routes/authRouter.js";
import userRoute from "./routes/userRouter.js";
import { authenticateUser } from "./middleware/authmiddleware.js";
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary";

// public
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";

dotenv.config();
const app = express();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const __dirname = dirname(fileURLToPath(import.meta.url));
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.static(path.resolve(__dirname, "./client/dist")));
app.use(express.json());
app.use(cookieParser());
app.get("/api/v1/test", (req, res) => {
  res.json({ msg: "test route" });
});
// routes middleware
app.use("/api/v1/jobs", authenticateUser, jobsRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", authenticateUser, userRoute);

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client/dist", "index.html"));
});
app.use("*", (req, res) => {
  res.status(404).json({
    message: "not found",
  });
});
app.use(errorHandlerMiddleware);

try {
  await mongoose.connect(process.env.MONGO_URL);
  const port = process.env.PORT || 5100;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
} catch (error) {
  console.log(error);
  process.exit(1);
}
