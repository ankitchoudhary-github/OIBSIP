import { useEffect } from "react";
import { Routes, Route , useLocation } from "react-router-dom";
import Menu from "./pages/menu/Menu";
import CartToast from "./components/ui/CartToast";
import { useCart } from "./context/CartContext";

import Navbar from "./components/layout/Navbar";
import Hero from "./components/landing/Hero";
import FeaturedPizzas from "./components/landing/FeaturedPizzas";
import PizzaCustomizer from "./components/customize/PizzaCustomizer";
import Footer from "./components/layout/Footer";

import Checkout from "./pages/checkout/Checkout";


function Home() {
  const location = useLocation();

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

  useEffect(() => {
    if (!location.state?.openCart) return;

    const timer = setTimeout(() => {
      window.dispatchEvent(
        new Event("pizzaro:open-cart"),
      );

      window.history.replaceState(
        {},
        document.title,
        window.location.pathname,
      );
    }, 100);

    return () => clearTimeout(timer);
  }, [location.state]);

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
      <Route path="/menu" element={<Menu />} />
      <Route path="/checkout" element={<Checkout />} />
    </Routes>
  );
}

export default App;