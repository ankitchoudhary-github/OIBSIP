import express from "express";
import {
  createOrderController,
  getOrderController,
  getMyOrdersController,
  getTrackingOrderController,
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
  "/:orderId/tracking",
  requireUser,
  getTrackingOrderController,
);

router.get(
  "/:orderId",
  requireUser,
  getOrderController,
);

export default router;