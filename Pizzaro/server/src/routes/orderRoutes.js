import express from "express";

import {
  createOrderController,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/", createOrderController);

export default router;