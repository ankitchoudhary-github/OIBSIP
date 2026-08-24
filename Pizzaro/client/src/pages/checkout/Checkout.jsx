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

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

const handleSubmit = async (event) => {
  event.preventDefault();

  const {
    name,
    phone,
    address,
    city,
    state,
    pincode,
  } = form;

  if (
    !name.trim() ||
    !phone.trim() ||
    !address.trim() ||
    !city.trim() ||
    !state.trim() ||
    !pincode.trim()
  ) {
    setError("Please fill in all delivery details.");
    return;
  }

  setError("");

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/orders`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cartItems.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
          })),

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

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to create order.",
      );
    }

    console.log("Order created:", data.order);

  } catch (error) {
    console.error("Checkout error:", error);

    setError(
      error.message ||
        "Something went wrong while creating your order.",
    );
  }
};

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
                className="w-full rounded-full bg-pizzaro-dark px-6 py-4 text-sm font-semibold text-white transition hover:bg-pizzaro-red"
              >
                Continue to Payment
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