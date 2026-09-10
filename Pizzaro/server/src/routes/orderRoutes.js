import express from "express";

import {
  createOrderController,
  getOrderController,
} from "../controllers/orderController.js";

import { requireUser } from "../middleware/userAuth.js";

const router = express.Router();

router.post(
  "/",
  requireUser,
  createOrderController,
);

router.get(
  "/:orderId",
  getOrderController,
);

export default router;