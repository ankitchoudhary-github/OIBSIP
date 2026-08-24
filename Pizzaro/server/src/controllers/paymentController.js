import {
  createPaymentForOrder,
} from "../services/paymentService.js";

export async function createPaymentController(
  req,
  res,
) {
  try {
    const { orderId } = req.body;

    const result =
      await createPaymentForOrder(orderId);

    return res.status(201).json({
      success: true,
      message:
        "Razorpay order created successfully.",

      payment: {
        keyId:
          process.env.RAZORPAY_KEY_ID,

        orderId:
          result.razorpayOrder.id,

        amount:
          result.razorpayOrder.amount,

        currency:
          result.razorpayOrder.currency,

        mongoOrderId:
          result.order._id,
      },
    });
  } catch (error) {
    console.error(
      "Create payment error:",
      error.message,
    );

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}