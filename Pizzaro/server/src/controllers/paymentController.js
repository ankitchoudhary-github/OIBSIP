import {
  createPaymentForOrder,
  verifyRazorpayPayment,
} from "../services/paymentService.js";

export async function createPaymentController(req, res) {
  try {
    const { orderId } = req.body;

    const result = await createPaymentForOrder(orderId);

    return res.status(201).json({
      success: true,
      message: "Razorpay order created successfully.",

      payment: {
        keyId: process.env.RAZORPAY_KEY_ID,
        orderId: result.razorpayOrder.id,
        amount: result.razorpayOrder.amount,
        currency: result.razorpayOrder.currency,
        mongoOrderId: result.order._id,
        reused: result.reused ?? false,
      },
    });
  } catch (error) {
    console.error("Create payment error:", error.message);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

export async function verifyPaymentController(req, res) {
  try {
    const {
      mongoOrderId,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
    } = req.body;

    const result = await verifyRazorpayPayment({
      mongoOrderId,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
    });

    return res.status(200).json({
      success: true,
      message: result.alreadyPaid
        ? "Payment was already verified."
        : "Payment verified successfully.",

      order: result.order,
    });
  } catch (error) {
    console.error("Verify payment error:", error.message);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}
