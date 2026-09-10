import {
  createOrder,
  getOrderById,
  getOrdersByUserId,
} from "../services/orderService.js";

export async function getOrderController(req, res) {
  try {
    const { orderId } = req.params;

    const order = await getOrderById(orderId, req.user._id);

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Get order error:", error.message);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to get order.",
    });
  }
}

export async function createOrderController(req, res) {
  try {
    const { items, customer } = req.body;

    const order = await createOrder({
      userId: req.user._id,
      items,
      customer,
    });

    return res.status(201).json({
      success: true,
      message: "Order created successfully.",
      order,
    });
  } catch (error) {
    console.error("Create order error:", error.message);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

export async function getMyOrdersController(req, res) {
  try {
    const orders = await getOrdersByUserId(req.user._id);

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Get my orders error:", error.message);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to get your orders.",
    });
  }
}
