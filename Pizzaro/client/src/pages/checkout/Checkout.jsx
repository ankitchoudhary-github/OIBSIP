import { ArrowLeft, MapPin, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/useCart";

const Checkout = ({ onBack }) => {
  const navigate = useNavigate();
  const {
    cartItems,
    subtotal,
    orderSuggestions,
    clearCart,
  } = useCart();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [error, setError] = useState("");

  const [paymentSuccess, setPaymentSuccess] =
    useState(false);

  const [completedOrder, setCompletedOrder] =
    useState(null);

  const [isProcessingPayment, setIsProcessingPayment] =
    useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isProcessingPayment) {
      return;
    }

    setIsProcessingPayment(true);
    const {
      name,
      phone,
      address,
      city,
      state,
      pincode,
    } = form;

    /* =========================
       VALIDATE DELIVERY DETAILS
    ========================== */

    if (
      !name.trim() ||
      !phone.trim() ||
      !address.trim() ||
      !city.trim() ||
      !state.trim() ||
      !pincode.trim()
    ) {
      setError(
        "Please fill in all delivery details.",
      );
      return;
    }

    setError("");

    try {
      /* =========================
         STEP 1
         CREATE MONGODB ORDER
      ========================== */

      const orderResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/api/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: cartItems.map((item) => {
              if (item.type === "custom") {
                return {
                  type: "custom",
                  quantity: item.quantity,
                  customization: {
                    baseId: item.baseId,
                    sauceId: item.sauceId,
                    cheeseId: item.cheeseId,
                    vegetableIds:
                      item.vegetableIds,
                  },
                };
              }

              return {
                type: "menu",
                productId: item.id,
                quantity: item.quantity,
              };
            }),

            customer: {
              name: name.trim(),
              phone: phone.trim(),
              address: address.trim(),
              city: city.trim(),
              state: state.trim(),
              pincode: pincode.trim(),
            },
          }),
        },
      );

      const orderData =
        await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(
          orderData.message ||
          "Failed to create order.",
        );
      }

      const mongoOrder =
        orderData.order;

      console.log(
        "MongoDB order created:",
        mongoOrder,
      );

      /* =========================
         STEP 2
         CREATE RAZORPAY ORDER
      ========================== */

      const paymentResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/api/payments/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId: mongoOrder._id,
          }),
        },
      );

      const paymentData =
        await paymentResponse.json();

      if (!paymentResponse.ok) {
        throw new Error(
          paymentData.message ||
          "Failed to create payment.",
        );
      }

      console.log(
        "Razorpay order created:",
        paymentData,
      );

      /* =========================
         STEP 3
         OPEN RAZORPAY CHECKOUT
      ========================== */

      if (typeof window.Razorpay !== "function") {
        throw new Error(
          "Razorpay Checkout failed to load.",
        );
      }

      const options = {
        key: paymentData.payment.keyId,

        amount:
          paymentData.payment.amount,

        currency:
          paymentData.payment.currency,

        name: "Pizzaro",

        description:
          "Pizzaro Pizza Order",

        order_id:
          paymentData.payment.orderId,

        prefill: {
          name: name.trim(),
          contact: phone.trim(),
        },

        notes: {
          mongoOrderId:
            mongoOrder._id,
        },

        theme: {
          color: "#e53935",
        },

        handler: async function (response) {
          try {
            console.log(
              "Razorpay payment response:",
              response,
            );

            const verifyResponse = await fetch(
              `${import.meta.env.VITE_API_URL}/api/payments/verify`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  mongoOrderId: mongoOrder._id,
                  razorpayPaymentId:
                    response.razorpay_payment_id,
                  razorpayOrderId:
                    response.razorpay_order_id,
                  razorpaySignature:
                    response.razorpay_signature,
                }),
              },
            );

            const verifyData =
              await verifyResponse.json();

            if (!verifyResponse.ok) {
              throw new Error(
                verifyData.message ||
                "Payment verification failed.",
              );
            }

            console.log(
              "Payment verified successfully:",
              verifyData.order,
            );

            setIsProcessingPayment(false);
            clearCart();

            navigate(
              `/order-confirmation/${verifyData.order._id}`,
            );

          } catch (error) {
            console.error(
              "Payment verification error:",
              error,
            );

            setError(
              error.message ||
              "Payment could not be verified.",
            );
          }
        },


        modal: {
          ondismiss: function () {
            console.log(
              "Razorpay Checkout closed.",
            );

            setIsProcessingPayment(false);
          },
        },
      };

      const razorpay =
        new window.Razorpay(options);

      razorpay.open();
    } catch (error) {
      console.error(
        "Checkout error:",
        error,
      );

      setError(
        error.message ||
        "Something went wrong during checkout.",
      );

      setIsProcessingPayment(false);
    }
  };


  if (paymentSuccess) {
    return (
      <main className="min-h-screen bg-pizzaro-cream px-6 pb-24 pt-32">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-4xl bg-white px-6 py-16 text-center shadow-pizzaro">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl">
              ✓
            </div>

            <p className="mt-6 text-sm font-bold uppercase tracking-[4px] text-pizzaro-red">
              ORDER CONFIRMED
            </p>

            <h1 className="mt-3 font-display text-4xl font-bold text-pizzaro-dark md:text-5xl">
              Pizza is on the way.
            </h1>

            <p className="mx-auto mt-4 max-w-lg text-lg leading-8 text-pizzaro-muted">
              Your payment was successful and your order
              has been confirmed.
            </p>

            {completedOrder?._id && (
              <div className="mt-6 rounded-2xl bg-pizzaro-cream px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-[2px] text-pizzaro-muted">
                  Order ID
                </p>

                <p className="mt-2 break-all font-mono text-sm font-semibold text-pizzaro-dark">
                  {completedOrder._id}
                </p>
              </div>
            )}

            {completedOrder?.subtotal != null && (
              <p className="mt-6 text-lg font-semibold text-pizzaro-dark">
                Total paid: ₹{completedOrder.subtotal}
              </p>
            )}

            <button
              type="button"
              onClick={() => navigate("/")}
              className="mt-8 rounded-full bg-pizzaro-dark px-7 py-4 text-sm font-semibold text-white transition hover:bg-pizzaro-red"
            >
              Back to Home
            </button>
          </div>
        </div>
      </main>
    );
  }





  return (
    <main className="min-h-screen bg-pizzaro-cream px-6 pb-20 pt-32">
      <div className="mx-auto max-w-7xl">
        {/* Back */}
        <button
          type="button"
          onClick={() => {
            navigate("/", {
              state: {
                openCart: true,
              },
            });
          }}
          className="mb-8 flex items-center gap-2 text-sm font-semibold text-pizzaro-dark transition hover:text-pizzaro-red"
        >
          <ArrowLeft size={18} />
          Back to Cart
        </button>

        {/* Heading */}
        <div className="mb-10">
          <p className="mb-3 text-sm font-bold uppercase tracking-[4px] text-pizzaro-red">
            CHECKOUT
          </p>

          <h1 className="font-display text-4xl font-bold tracking-tight text-pizzaro-dark md:text-5xl">
            Almost there.
          </h1>

          <p className="mt-3 text-lg text-pizzaro-muted">
            Confirm your delivery details and review your order.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Delivery */}
          <section className="rounded-4xl bg-white p-6 shadow-pizzaro sm:p-8">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pizzaro-red/10 text-pizzaro-red">
                <MapPin size={20} />
              </div>

              <div>
                <h2 className="font-display text-2xl font-bold text-pizzaro-dark">
                  Delivery details
                </h2>

                <p className="mt-1 text-sm text-pizzaro-muted">
                  Where should we deliver your pizza?
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-semibold text-pizzaro-dark"
                  >
                    Full name
                  </label>

                  <input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="w-full rounded-2xl border border-black/10 px-4 py-3 text-sm outline-none transition focus:border-pizzaro-red focus:ring-2 focus:ring-pizzaro-red/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-semibold text-pizzaro-dark"
                  >
                    Phone number
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    className="w-full rounded-2xl border border-black/10 px-4 py-3 text-sm outline-none transition focus:border-pizzaro-red focus:ring-2 focus:ring-pizzaro-red/10"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="address"
                  className="mb-2 block text-sm font-semibold text-pizzaro-dark"
                >
                  Delivery address
                </label>

                <textarea
                  id="address"
                  name="address"
                  rows={4}
                  value={form.address}
                  onChange={handleChange}
                  placeholder="House / Flat, Street, Area"
                  className="w-full resize-none rounded-2xl border border-black/10 px-4 py-3 text-sm outline-none transition focus:border-pizzaro-red focus:ring-2 focus:ring-pizzaro-red/10"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-3">
                <div>
                  <label
                    htmlFor="city"
                    className="mb-2 block text-sm font-semibold text-pizzaro-dark"
                  >
                    City
                  </label>

                  <input
                    id="city"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="City"
                    className="w-full rounded-2xl border border-black/10 px-4 py-3 text-sm outline-none transition focus:border-pizzaro-red focus:ring-2 focus:ring-pizzaro-red/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="state"
                    className="mb-2 block text-sm font-semibold text-pizzaro-dark"
                  >
                    State
                  </label>

                  <input
                    id="state"
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    placeholder="State"
                    className="w-full rounded-2xl border border-black/10 px-4 py-3 text-sm outline-none transition focus:border-pizzaro-red focus:ring-2 focus:ring-pizzaro-red/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="pincode"
                    className="mb-2 block text-sm font-semibold text-pizzaro-dark"
                  >
                    Pincode
                  </label>

                  <input
                    id="pincode"
                    name="pincode"
                    value={form.pincode}
                    onChange={handleChange}
                    maxLength={6}
                    inputMode="numeric"
                    placeholder="110001"
                    className="w-full rounded-2xl border border-black/10 px-4 py-3 text-sm outline-none transition focus:border-pizzaro-red focus:ring-2 focus:ring-pizzaro-red/10"
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                  {error}
                </div>
              )}


              <button
                type="submit"
                disabled={isProcessingPayment}
                className="w-full rounded-full bg-pizzaro-dark px-6 py-4 text-sm font-semibold text-white transition hover:bg-pizzaro-red disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isProcessingPayment
                  ? "Processing Payment..."
                  : "Continue to Payment"}
              </button>

            </form>
          </section>

          {/* Order summary */}
          <section className="h-fit rounded-4xl bg-white p-6 shadow-pizzaro sm:p-8">
            <div className="mb-7 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pizzaro-red/10 text-pizzaro-red">
                <ShoppingBag size={20} />
              </div>

              <div>
                <h2 className="font-display text-2xl font-bold text-pizzaro-dark">
                  Your order
                </h2>

                <p className="mt-1 text-sm text-pizzaro-muted">
                  {cartItems.length} item
                  {cartItems.length === 1 ? "" : "s"}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl bg-pizzaro-cream p-4"
                >
                  <div className="flex gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#f5e8dc]">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-contain p-1"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-semibold text-pizzaro-dark">
                          {item.name}
                        </h3>

                        <span className="shrink-0 text-sm font-bold text-pizzaro-dark">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-pizzaro-muted">
                        Qty: {item.quantity}
                      </p>

                      {item.type === "custom" && (
                        <div className="mt-2 text-xs leading-5 text-pizzaro-muted">
                          <p>
                            {item.base} · {item.sauce} ·{" "}
                            {item.cheese}
                          </p>

                          {item.vegetables?.length > 0 && (
                            <p>
                              {item.vegetables.join(" · ")}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {orderSuggestions && (
                <div className="rounded-2xl border border-black/5 bg-white px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[1.5px] text-pizzaro-red">
                    Order note
                  </p>

                  <p className="mt-1 text-sm leading-6 text-pizzaro-muted">
                    {orderSuggestions}
                  </p>
                </div>
              )}

              <div className="border-t border-black/5 pt-5">
                <div className="flex justify-between text-sm">
                  <span className="text-pizzaro-muted">
                    Subtotal
                  </span>

                  <span className="font-semibold text-pizzaro-dark">
                    ₹{subtotal}
                  </span>
                </div>

                <div className="mt-3 flex justify-between text-sm">
                  <span className="text-pizzaro-muted">
                    Delivery
                  </span>

                  <span className="font-semibold text-pizzaro-green">
                    Free
                  </span>
                </div>

                <div className="my-4 border-t border-black/5" />

                <div className="flex items-end justify-between">
                  <span className="text-sm text-pizzaro-muted">
                    Total
                  </span>

                  <span className="font-display text-3xl font-bold text-pizzaro-dark">
                    ₹{subtotal}
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Checkout;