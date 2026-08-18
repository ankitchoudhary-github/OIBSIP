import Navbar from "./components/layout/Navbar";
import Hero from "./components/landing/Hero";
import FeaturedPizzas from "./components/landing/FeaturedPizzas";
import PizzaCustomizer from "./components/customize/PizzaCustomizer";

function App() {
  return (
    <main className="min-h-screen bg-pizzaro-cream">
      <Navbar />

      <Hero />

      <FeaturedPizzas />

      <PizzaCustomizer />
    </main>
  );
}

export default App;