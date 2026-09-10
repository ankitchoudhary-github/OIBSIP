import express from "express";

import {
  getAdminOrdersController,
  updateAdminOrderStatusController,
} from "../controllers/adminOrderController.js";

import { requireAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

router.get(
  "/",
  requireAdmin,
  getAdminOrdersController,
);

router.patch(
  "/:orderId/status",
  requireAdmin,
  updateAdminOrderStatusController,
);

export default router;