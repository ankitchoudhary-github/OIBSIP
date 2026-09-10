import express from "express";

import {
  registerUserController,
  verifyEmailController,
  loginUserController,
  getCurrentUserController,
  forgotPasswordController,
  resetPasswordController,
} from "../controllers/authController.js";

import { requireUser } from "../middleware/userAuth.js";

const router = express.Router();

router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password/:token", resetPasswordController);
router.post("/register", registerUserController);

router.get(
  "/verify-email/:token",
  verifyEmailController,
);

router.post("/login", loginUserController);

router.get(
  "/me",
  requireUser,
  getCurrentUserController,
);

export default router;