import express from "express";
import {
  forgotPasswordController,
  loginController,
  registerController,
  resetPasswordController,
} from "../Controller/UserController.js";

const router = express.Router();

router.post("/register", registerController);

router.post("/login", loginController);

router.post("/forgot-password", forgotPasswordController);

router.post("/reset-password", resetPasswordController);

export default router;
