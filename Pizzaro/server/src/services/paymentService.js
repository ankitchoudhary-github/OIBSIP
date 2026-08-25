import crypto from "node:crypto";

import razorpay from "../config/razorpay.js";
import Order from "../models/Order.js";

export async function createRazorpayOrder({ amount, receipt }) {
  if (!Number.isInteger(amount) || amount <= 0) {
    throw new Error("Payment amount must be a positive integer.");
  }

  const options = {
    amount: amount * 100,
    currency: "INR",
    receipt,
  };

  const razorpayOrder = await razorpay.orders.create(options);

  return razorpayOrder;
}

export async function verifyRazorpayPayment({
  mongoOrderId,
  razorpayPaymentId,
  razorpayOrderId,
  razorpaySignature,
}) {
  if (!mongoOrderId) {
    throw new Error("MongoDB order ID is required.");
  }

  if (!razorpayPaymentId) {
    throw new Error("Razorpay payment ID is required.");
  }

  if (!razorpayOrderId) {
    throw new Error("Razorpay order ID is required.");
  }

  if (!razorpaySignature) {
    throw new Error("Razorpay signature is required.");
  }

  const order = await Order.findById(mongoOrderId);

  if (!order) {
    throw new Error("Order not found.");
  }

  /*
    If this order was already successfully verified,
    don't process it again.
  */
  if (order.payment.status === "paid") {
    return {
      order,
      alreadyPaid: true,
    };
  }

  /*
    IMPORTANT:
    Use the Razorpay order ID stored in OUR database.
    Do not use the browser-supplied order ID as the
    source of truth for the signature calculation.
  */
  const storedRazorpayOrderId = order.payment.razorpayOrderId;

  if (!storedRazorpayOrderId) {
    throw new Error("No Razorpay order is associated with this order.");
  }

  if (storedRazorpayOrderId !== razorpayOrderId) {
    throw new Error("Razorpay order ID does not match our order.");
  }

  const body = `${storedRazorpayOrderId}|` + razorpayPaymentId;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  /*
    Use a timing-safe comparison instead of ===.
  */
  const expectedBuffer = Buffer.from(expectedSignature, "hex");

  const receivedBuffer = Buffer.from(razorpaySignature, "hex");

  if (expectedBuffer.length !== receivedBuffer.length) {
    throw new Error("Invalid Razorpay signature.");
  }

  const isSignatureValid = crypto.timingSafeEqual(
    expectedBuffer,
    receivedBuffer,
  );

  if (!isSignatureValid) {
    throw new Error("Invalid Razorpay signature.");
  }

  /*
    Signature is valid.
    Store the payment details for audit/idempotency.
  */
  await Order.updateOne(
    { _id: order._id },
    {
      $set: {
        "payment.status": "paid",
        "payment.provider": "razorpay",
        "payment.razorpayOrderId": storedRazorpayOrderId,
        "payment.paymentId": razorpayPaymentId,
        status: "confirmed",
      },

      $unset: {
        "payment.orderId": "",
      },
    },
  );

  const updatedOrder = await Order.findById(order._id);

  return {
    order: updatedOrder,
    alreadyPaid: false,
  };
}

export async function createPaymentForOrder(orderId) {
  if (!orderId) {
    throw new Error("Order ID is required.");
  }

  const order = await Order.findById(orderId);

  if (!order) {
    throw new Error("Order not found.");
  }

  if (order.payment.status === "paid") {
    throw new Error("This order has already been paid.");
  }

  if (order.status === "cancelled") {
    throw new Error("Cancelled orders cannot be paid.");
  }

  if (order.payment?.razorpayOrderId && order.payment.status === "pending") {
    return {
      order,
      razorpayOrder: {
        id: order.payment.razorpayOrderId,
        amount: order.subtotal * 100,
        currency: "INR",
      },
      reused: true,
    };
  }
  /*
    IMPORTANT:
    The amount comes from our database order.
    We do NOT accept an amount from the client.
  */
  const amount = order.subtotal;

  const razorpayOrder = await createRazorpayOrder({
    amount,
    receipt: order._id.toString(),
  });

  await Order.updateOne(
    { _id: order._id },
    {
      $set: {
        "payment.provider": "razorpay",
        "payment.razorpayOrderId": razorpayOrder.id,
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
