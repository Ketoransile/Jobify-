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

const router = express.Router();

router.post("/register", validateRegisterInput, register);
router.post("/login", validateLoginInput, login);
router.get("/logout", logout);
router.get("/getAllUsers", getAllUsers);
export default router;
