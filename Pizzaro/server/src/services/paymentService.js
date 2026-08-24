import razorpay from "../config/razorpay.js";
import Order from "../models/Order.js";

export async function createRazorpayOrder({
  amount,
  receipt,
}) {
  if (
    !Number.isInteger(amount) ||
    amount <= 0
  ) {
    throw new Error(
      "Payment amount must be a positive integer.",
    );
  }

  const options = {
    amount: amount * 100,
    currency: "INR",
    receipt,
  };

  const razorpayOrder =
    await razorpay.orders.create(options);

  return razorpayOrder;
}

export async function createPaymentForOrder(
  orderId,
) {
  if (!orderId) {
    throw new Error("Order ID is required.");
  }

  const order = await Order.findById(orderId);

  if (!order) {
    throw new Error("Order not found.");
  }

  if (order.payment.status === "paid") {
    throw new Error(
      "This order has already been paid.",
    );
  }

  if (order.status === "cancelled") {
    throw new Error(
      "Cancelled orders cannot be paid.",
    );
  }

  /*
    IMPORTANT:
    The amount comes from our database order.
    We do NOT accept an amount from the client.
  */
  const amount = order.subtotal;

  const razorpayOrder =
    await createRazorpayOrder({
      amount,
      receipt: order._id.toString(),
    });

  await Order.updateOne(
  { _id: order._id },
  {
    $set: {
      "payment.provider": "razorpay",
      "payment.razorpayOrderId":
        razorpayOrder.id,
      "payment.status": "pending",
    },

    $unset: {
      "payment.orderId": "",
    },
  },
);

  return {
    order,
    razorpayOrder,
  };
}