import express from "express";

import {
  registerUserController,
  verifyEmailController,
  loginUserController,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUserController);

router.get(
  "/verify-email/:token",
  verifyEmailController,
);

router.post("/login", loginUserController);

export default router;