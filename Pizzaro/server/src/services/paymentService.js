import razorpay from "../config/razorpay.js";

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