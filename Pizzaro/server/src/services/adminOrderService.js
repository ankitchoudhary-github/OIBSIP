import mongoose from "mongoose";
import Order from "../models/Order.js";

const VALID_STATUSES = [
  "pending",
  "confirmed",
  "preparing",
  "out_for_delivery",
  "delivered",
  "cancelled",
];

export async function getAllOrders() {
  return Order.find({})
    .sort({ createdAt: -1 })
    .lean();
}

export async function updateOrderStatus(orderId, status) {
  if (!mongoose.isValidObjectId(orderId)) {
    throw new Error("Invalid order ID.");
  }

  if (!VALID_STATUSES.includes(status)) {
    throw new Error(
      `Invalid order status. Allowed values: ${VALID_STATUSES.join(", ")}`,
    );
  }

  const order = await Order.findById(orderId);

  if (!order) {
    throw new Error("Order not found.");
  }

  if (order.status === status) {
    throw new Error(
      `Order is already in "${status}" status.`,
    );
  }

  order.status = status;

  await order.save();

  return order.toObject();
}