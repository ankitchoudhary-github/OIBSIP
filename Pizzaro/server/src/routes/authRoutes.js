import express from "express";

import {
  registerUserController,
  verifyEmailController,
  loginUserController,
  getCurrentUserController,
} from "../controllers/authController.js";

import { requireUser } from "../middleware/userAuth.js";

const router = express.Router();

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