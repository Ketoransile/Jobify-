import express from "express";
import {
  getAllUsers,
  login,
  logout,
  register,
} from "../controllers/authController.js";
import {
  validateRegisterInput,
  validateLoginInput,
} from "../middleware/validationMiddleware.js";
import rateLimiter from "express-rate-limit";

const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: { msg: "IP rate limit exceeded, retry in 15 Minutes" },
});
const router = express.Router();

router.post("/register", apiLimiter, validateRegisterInput, register);
router.post("/login", apiLimiter, validateLoginInput, login);
router.get("/logout", logout);
router.get("/getAllUsers", getAllUsers);
export default router;
