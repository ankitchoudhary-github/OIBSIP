import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import CartToast from "./components/ui/CartToast";
import { useCart } from "./context/CartContext";

import Navbar from "./components/layout/Navbar";
import Hero from "./components/landing/Hero";
import FeaturedPizzas from "./components/landing/FeaturedPizzas";
import PizzaCustomizer from "./components/customize/PizzaCustomizer";
import Footer from "./components/layout/Footer";

import Checkout from "./pages/checkout/Checkout";

function Home() {
  const {
    lastAddedItem,
    clearLastAddedItem,
  } = useCart();

  useEffect(() => {
    if (!lastAddedItem) return;

    const timer = setTimeout(() => {
      clearLastAddedItem();
    }, 3000);

    return () => clearTimeout(timer);
  }, [lastAddedItem, clearLastAddedItem]);

  return (
    <main className="min-h-screen bg-pizzaro-cream">
      <Navbar />

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

      <Hero />

      <FeaturedPizzas />

      <PizzaCustomizer />

      <Footer />
    </main>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/checkout" element={<Checkout />} />
    </Routes>
  );
}

export default App;