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

useEffect(() => {
  const handleHashChange = () => {
    setIsCheckout(window.location.hash === "#checkout");
  };

  window.addEventListener("hashchange", handleHashChange);

  return () => {
    window.removeEventListener("hashchange", handleHashChange);
  };
}, []);

  const { lastAddedItem, clearLastAddedItem } = useCart();

  useEffect(() => {
    if (!lastAddedItem) return;

    const timer = setTimeout(() => {
      clearLastAddedItem();
    }, 3000);

    return () => clearTimeout(timer);
  }, [lastAddedItem, clearLastAddedItem]);

  if (isCheckout) {
  return (
    <Checkout
      onBack={() => {
        window.location.hash = "customize";
      }}
    />
  );
}

  return (
    <main className="min-h-screen bg-pizzaro-cream">
      <Navbar />

      <CartToast
        item={lastAddedItem}
        onClose={clearLastAddedItem}
        onViewCart={() => {
          window.dispatchEvent(
            new Event("pizzaro:open-cart")
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

export default App;