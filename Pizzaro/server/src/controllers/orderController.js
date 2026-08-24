import { createOrder } from "../services/orderService.js";

export async function createOrderController(req, res) {
  try {
    const { items, customer } = req.body;

    const order = await createOrder({
      items,
      customer,
    });

    return res.status(201).json({
      success: true,
      message: "Order created successfully.",
      order,
    });
  } catch (error) {
    console.error(
      "Create order error:",
      error.message,
    );

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}