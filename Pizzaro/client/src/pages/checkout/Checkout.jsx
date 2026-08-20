import { ArrowLeft, MapPin, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useCart } from "../../context/CartContext";

const Checkout = ({ onBack }) => {
  const { cartItems, subtotal } = useCart();

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

  const handleSubmit = (event) => {
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

    console.log("Checkout data:", {
      customer: form,
      items: cartItems,
      subtotal,
    });
  };

  return (
    <main className="min-h-screen bg-pizzaro-cream px-6 pb-20 pt-16">
      <div className="mx-auto max-w-7xl">
        {/* Checkout Header */}
        <div className="mb-10 px-6 sm:px-8">
          <button
            type="button"
            onClick={onBack}
            className="mb-8 flex items-center gap-2 text-sm font-semibold text-pizzaro-dark transition hover:text-pizzaro-red"
          >
            <ArrowLeft size={18} />
            Back to Cart
          </button>

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

        {/* Main Checkout */}
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Delivery Details */}
          <section className="rounded-4xl bg-white p-6 shadow-pizzaro sm:p-8">
            {/* Section header */}
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

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Name + Phone */}
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
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-pizzaro-dark outline-none transition placeholder:text-pizzaro-muted/70 focus:border-pizzaro-red focus:ring-2 focus:ring-pizzaro-red/10"
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
                    className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-pizzaro-dark outline-none transition placeholder:text-pizzaro-muted/70 focus:border-pizzaro-red focus:ring-2 focus:ring-pizzaro-red/10"
                  />
                </div>
              </div>

              {/* Address */}
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
                  className="w-full resize-none rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-pizzaro-dark outline-none transition placeholder:text-pizzaro-muted/70 focus:border-pizzaro-red focus:ring-2 focus:ring-pizzaro-red/10"
                />
              </div>

              {/* City / State / Pincode */}
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
                    type="text"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="City"
                    className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-pizzaro-dark outline-none transition placeholder:text-pizzaro-muted/70 focus:border-pizzaro-red focus:ring-2 focus:ring-pizzaro-red/10"
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
                    type="text"
                    value={form.state}
                    onChange={handleChange}
                    placeholder="State"
                    className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-pizzaro-dark outline-none transition placeholder:text-pizzaro-muted/70 focus:border-pizzaro-red focus:ring-2 focus:ring-pizzaro-red/10"
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
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={form.pincode}
                    onChange={handleChange}
                    placeholder="110001"
                    className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-pizzaro-dark outline-none transition placeholder:text-pizzaro-muted/70 focus:border-pizzaro-red focus:ring-2 focus:ring-pizzaro-red/10"
                  />
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                  {error}
                </div>
              )}

              {/* Payment button */}
              <button
                type="submit"
                className="w-full rounded-full bg-pizzaro-dark px-6 py-4 text-sm font-semibold text-white shadow-lg transition hover:bg-pizzaro-red"
              >
                Continue to Payment
              </button>
            </form>
          </section>

          {/* Order Summary */}
          <section className="h-fit rounded-4xl bg-white p-6 shadow-pizzaro sm:p-8">
            {/* Section header */}
            <div className="mb-7 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pizzaro-red/10 text-pizzaro-red">
                <ShoppingBag size={20} />
              </div>

              <div>
                <h2 className="font-display text-2xl font-bold text-pizzaro-dark">
                  Your order
                </h2>

                <p className="mt-1 text-sm text-pizzaro-muted">
                  {cartItems.length}{" "}
                  {cartItems.length === 1 ? "item" : "items"}
                </p>
              </div>
            </div>

            {/* Items */}
            {cartItems.length === 0 ? (
              <div className="rounded-2xl bg-pizzaro-cream p-6 text-center">
                <p className="text-sm text-pizzaro-muted">
                  Your cart is empty.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl bg-pizzaro-cream p-4"
                  >
                    <div className="flex gap-4">
                      {/* Product image */}
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#f5e8dc]">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-contain p-1"
                        />
                      </div>

                      {/* Product info */}
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

                        {/* Custom pizza details */}
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

                        {/* Menu pizza description */}
                        {item.type === "menu" &&
                          item.description && (
                            <p className="mt-2 text-xs leading-5 text-pizzaro-muted">
                              {item.description}
                            </p>
                          )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Price summary */}
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
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default Checkout;