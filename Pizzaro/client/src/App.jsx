import { useEffect, useState } from "react";

import CartToast from "./components/ui/CartToast";
import { useCart } from "./context/CartContext";

import Navbar from "./components/layout/Navbar";
import Hero from "./components/landing/Hero";
import FeaturedPizzas from "./components/landing/FeaturedPizzas";
import PizzaCustomizer from "./components/customize/PizzaCustomizer";

import Checkout from "./pages/checkout/Checkout";
import Footer from "./components/layout/Footer";

function App() {
  const [isCheckout, setIsCheckout] = useState(
    window.location.hash === "#checkout",
  );

  const [openCartAfterReturn, setOpenCartAfterReturn] =
    useState(false);

  const { lastAddedItem, clearLastAddedItem } = useCart();

  /* =========================
     HASH / CHECKOUT HANDLING
  ========================== */
  useEffect(() => {
    const handleHashChange = () => {
      setIsCheckout(window.location.hash === "#checkout");
    };

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener(
        "hashchange",
        handleHashChange,
      );
    };
  }, []);

  /* =========================
     OPEN CART AFTER CHECKOUT
  ========================== */
  useEffect(() => {
    if (isCheckout || !openCartAfterReturn) {
      return;
    }

    const frame = requestAnimationFrame(() => {
      window.dispatchEvent(
        new Event("pizzaro:open-cart"),
      );

      setOpenCartAfterReturn(false);
    });

    return () => cancelAnimationFrame(frame);
  }, [isCheckout, openCartAfterReturn]);

  /* =========================
     ADD TO CART TOAST
  ========================== */
  useEffect(() => {
    if (!lastAddedItem) {
      return;
    }

    const timer = setTimeout(() => {
      clearLastAddedItem();
    }, 3000);

    return () => clearTimeout(timer);
  }, [lastAddedItem, clearLastAddedItem]);

  /* =========================
     CHECKOUT PAGE
  ========================== */
  if (isCheckout) {
    return (
      <Checkout
        onBack={() => {
          setOpenCartAfterReturn(true);

          window.location.hash = "";
        }}
      />
    );
  }

  /* =========================
     HOMEPAGE
  ========================== */
  return (
    <main className="min-h-screen bg-pizzaro-cream">
      <Navbar />

      {/* Add to Cart Toast */}
      <CartToast
        item={lastAddedItem}
        onClose={clearLastAddedItem}
        onViewCart={() => {
          window.dispatchEvent(
            new Event("pizzaro:open-cart"),
          );

          clearLastAddedItem();
        }}
      />

      {/* Hero */}
      <Hero />

      {/* Featured Menu */}
      <FeaturedPizzas />

      {/* Pizza Customizer */}
      <PizzaCustomizer />

      {/* Footer */}
      <Footer />
    </main>
  );
}

export default App;