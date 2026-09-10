import {
  getAllOrders,
  updateOrderStatus,
} from "../services/adminOrderService.js";

export async function getAdminOrdersController(req, res) {
  try {
    const orders = await getAllOrders();

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error(
      "Get admin orders error:",
      error.message,
    );

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to get orders.",
    });
  }
}

export async function updateAdminOrderStatusController(
  req,
  res,
) {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await updateOrderStatus(
      orderId,
      status,
    );

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully.",
      order,
    });
  } catch (error) {
    console.error(
      "Update admin order status error:",
      error.message,
    );

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}