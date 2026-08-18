import Navbar from "./components/layout/Navbar";
import Button from "./components/ui/Button";

function App() {
  return (
    <main className="min-h-screen bg-pizzaro-cream">
      <Navbar />

      <section className="flex min-h-screen items-center justify-center px-6 pt-28">
        <div className="text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-pizzaro-red">
            Welcome to
          </p>

          <h1 className="font-display text-6xl font-bold tracking-tight text-pizzaro-dark">
            Pizzaro
          </h1>

          <p className="mt-4 text-lg text-pizzaro-muted">
            Pizza delivered your way.
          </p>

          <div className="mt-8 flex justify-center gap-3">
            <Button size="lg">
              Start Ordering
            </Button>

            <Button variant="outline" size="lg">
              Explore Menu
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;