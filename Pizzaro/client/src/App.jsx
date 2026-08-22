import HowItWorks from "./components/landing/HowItWorks";
import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import CartToast from "./components/ui/CartToast";
import { useCart } from "./context/useCart";

import Navbar from "./components/layout/Navbar";
import Hero from "./components/landing/Hero";
import FeaturedPizzas from "./components/landing/FeaturedPizzas";
import PizzaCustomizer from "./components/customize/PizzaCustomizer";
import Footer from "./components/layout/Footer";

import Menu from "./pages/menu/Menu";
import Checkout from "./pages/checkout/Checkout";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <FeaturedPizzas />
      <PizzaCustomizer />
      <HowItWorks />
      <Footer />
    </>
  );
}

function App() {
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
      {/* Global cart toast */}
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

      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/menu"
          element={<Menu />}
        />

        <Route
          path="/checkout"
          element={<Checkout />}
        />
      </Routes>
    </main>
  );
}

export default App;