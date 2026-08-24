import express from "express";

import {
  createPaymentController,
  verifyPaymentController,
} from "../controllers/paymentController.js";

const router = express.Router();

router.post(
  "/create",
  createPaymentController,
);

router.post(
  "/verify",
  verifyPaymentController,
);

export default router;