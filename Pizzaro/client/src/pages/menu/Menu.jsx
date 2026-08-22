import { useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import Navbar from "../../components/layout/Navbar";

import { useCart } from "../../context/useCart";
import { pizzas } from "../../data/pizzas";

const Menu = () => {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] =
    useSearchParams();

  const urlSearch = searchParams.get("search") ?? "";
  const urlCategory =
    searchParams.get("category") ?? "all";

  const [search, setSearch] = useState(urlSearch);

  const { addToCart } = useCart();

  useEffect(() => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "instant",
  });
}, []);


  /* =========================
     KEEP SEARCH INPUT IN SYNC
     WITH URL
  ========================== */
  useEffect(() => {
    setSearch(urlSearch);
  }, [urlSearch]);

  /* =========================
     UPDATE QUERY PARAMETERS
  ========================== */
  const updateSearchParams = ({
    searchValue = search,
    categoryValue = urlCategory,
  }) => {
    const params = new URLSearchParams();

    const trimmedSearch = searchValue.trim();

    if (trimmedSearch) {
      params.set("search", trimmedSearch);
    }

    if (categoryValue !== "all") {
      params.set("category", categoryValue);
    }

    setSearchParams(params);
  };

  /* =========================
     FILTER PIZZAS
  ========================== */
  const filteredPizzas = useMemo(() => {
    const normalizedSearch = urlSearch
      .trim()
      .toLowerCase();

    return pizzas.filter((pizza) => {
      const matchesSearch =
        !normalizedSearch ||
        pizza.name
          .toLowerCase()
          .includes(normalizedSearch) ||
        pizza.description
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesCategory =
        urlCategory === "all" ||
        pizza.category === urlCategory;

      return matchesSearch && matchesCategory;
    });
  }, [urlSearch, urlCategory]);

  /* =========================
     CLEAR SEARCH / FILTERS
  ========================== */
  const clearFilters = () => {
    setSearch("");
    setSearchParams({});
  };

  /* =========================
     ADD PIZZA TO CART
  ========================== */
  const handleAddToCart = (pizza) => {
    addToCart({
      id: pizza.id,
      type: "menu",
      name: pizza.name,
      description: pizza.description,
      image: pizza.image,
      price: pizza.price,
      quantity: 1,
    });
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-pizzaro-cream px-6 pb-24 pt-32">
        <div className="mx-auto max-w-7xl">

          {/* Back to Home */}
          <button
  type="button"
  onClick={() => navigate("/")}
  className="mb-8 rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-pizzaro-dark transition hover:border-pizzaro-red hover:text-pizzaro-red"
>
  ← Back to Home
</button>
          {/* Heading */}
          <div
            className="mb-10"
          >
            <p className="mb-3 text-sm font-bold uppercase tracking-[4px] text-pizzaro-red">
              OUR MENU
            </p>

            <h1 className="font-display text-5xl font-bold tracking-tight text-pizzaro-dark md:text-6xl">
              Find your pizza.
            </h1>

            <p className="mt-4 max-w-2xl text-lg leading-8 text-pizzaro-muted">
              Browse the classics or search for exactly what
              you're craving.
            </p>
          </div>

          {/* Search + Filters */}
          <div className="mb-10 flex flex-col gap-4 lg:flex-row">

            {/* Search */}
            <div className="relative flex-1">
              <Search
                size={19}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-pizzaro-muted"
              />

              <input
                type="search"
                value={search}
                onChange={(event) => {
                  const value = event.target.value;

                  setSearch(value);

                  updateSearchParams({
                    searchValue: value,
                  });
                }}
                placeholder="Search pizzas..."
                className="w-full rounded-full border border-black/10 bg-white py-4 pl-11 pr-11 text-sm text-pizzaro-dark outline-none transition placeholder:text-pizzaro-muted/70 focus:border-pizzaro-red focus:ring-2 focus:ring-pizzaro-red/10"
              />

              {search && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="absolute right-4 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-black/5 text-pizzaro-muted transition hover:bg-black/10 hover:text-pizzaro-dark"
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto">
              {[
                {
                  label: "All",
                  value: "all",
                },
                {
                  label: "Vegetarian",
                  value: "veg",
                },
                {
                  label: "Non-Vegetarian",
                  value: "nonveg",
                },
              ].map((category) => {
                const active =
                  urlCategory === category.value;

                return (
                  <button
                    key={category.value}
                    type="button"
                    onClick={() =>
                      updateSearchParams({
                        categoryValue: category.value,
                      })
                    }
                    className={`whitespace-nowrap rounded-full px-5 py-3 text-sm font-semibold transition ${active
                        ? "bg-pizzaro-dark text-white"
                        : "border border-black/10 bg-white text-pizzaro-muted hover:border-pizzaro-red hover:text-pizzaro-red"
                      }`}
                  >
                    {category.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Result count */}
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-pizzaro-muted">
              {filteredPizzas.length}{" "}
              {filteredPizzas.length === 1
                ? "pizza"
                : "pizzas"}{" "}
              found
            </p>

            {(urlSearch || urlCategory !== "all") && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm font-semibold text-pizzaro-red hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>

          {/* Pizza Grid */}
          {filteredPizzas.length === 0 ? (
            <div className="rounded-4xl bg-white px-6 py-20 text-center shadow-pizzaro">
              <h2 className="font-display text-3xl font-bold text-pizzaro-dark">
                No pizzas found.
              </h2>

              <p className="mt-3 text-sm text-pizzaro-muted">
                Try another search or clear your filters.
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="mt-6 rounded-full bg-pizzaro-red px-6 py-3 text-sm font-semibold text-white transition hover:bg-pizzaro-red-dark"
              >
                Show all pizzas
              </button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPizzas.map((pizza) => (
                <article
                  key={pizza.id}
                  className="group overflow-hidden rounded-4xl border border-black/5 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-pizzaro-lg"
                >
                  {/* Image */}
                  <div className="relative flex h-72 items-center justify-center overflow-hidden bg-[#f5e8dc]">
                    <img
                      src={pizza.image}
                      alt={pizza.name}
                      className="h-full w-full object-contain p-5 transition duration-500 group-hover:scale-105"
                    />

                    {/* Price */}
                    <div className="absolute right-4 top-4 rounded-full bg-white px-4 py-2 text-sm font-bold text-pizzaro-red shadow-md">
                      ₹{pizza.price}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-6">
                    <h2 className="font-display text-2xl font-bold text-pizzaro-dark">
                      {pizza.name}
                    </h2>

                    <p className="mt-2 min-h-12 text-sm leading-6 text-pizzaro-muted">
                      {pizza.description}
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        handleAddToCart(pizza)
                      }
                      className="mt-5 w-full rounded-full bg-pizzaro-dark py-3 text-sm font-semibold text-white transition hover:bg-pizzaro-red"
                    >
                      Add to Cart
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default Menu;