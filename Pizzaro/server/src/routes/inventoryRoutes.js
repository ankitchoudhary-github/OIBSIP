import express from "express";

import {
  getInventoryController,
  getLowStockController,
  updateInventoryController,
} from "../controllers/inventoryController.js";

import { requireAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

router.get("/", requireAdmin, getInventoryController);

router.get(
  "/low-stock",
  requireAdmin,
  getLowStockController,
);

router.patch(
  "/:optionId",
  requireAdmin,
  updateInventoryController,
);

export default router;