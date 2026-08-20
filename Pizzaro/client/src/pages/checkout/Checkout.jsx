import { ArrowLeft, MapPin, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useCart } from "../../context/CartContext";

const Checkout = ({ onBack }) => {
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

    console.log("Checkout data", {
      customer: form,
      items: cartItems,
      suggestions: orderSuggestions,
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

          <div>
            <p className=" mb-3 text-sm font-bold uppercase tracking-[4px] text-pizzaro-red">
              CHECKOUT
            </p>

            <h1 className="font-display text-4xl font-bold tracking-tight text-pizzaro-dark md:text-5xl">
              Almost there.
            </h1>

            <p className="mt-3 text-lg text-pizzaro-muted">
              Confirm your delivery details and review your order.
            </p>
          </div>
        </div>

        {/* Main Checkout */}
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Delivery Details */}
          ...

          {/* Your Order */}
          ...
        </div>
      </div>
    </main>
  );
};

export default Checkout;