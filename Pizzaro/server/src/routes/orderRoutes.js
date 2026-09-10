import express from "express";
import {
  createOrderController,
  getOrderController,
  getMyOrdersController,
} from "../controllers/orderController.js";
import { requireUser } from "../middleware/userAuth.js";

const router = express.Router();

router.post(
  "/",
  requireUser,
  createOrderController,
);

router.get(
  "/my-orders",
  requireUser,
  getMyOrdersController,
);

router.get(
  "/:orderId",
  requireUser,
  getOrderController,
);

export default router;