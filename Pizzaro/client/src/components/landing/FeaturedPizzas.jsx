import { useCart } from "../../context/CartContext";
import { pizzas } from "../../data/pizzas";
import { useNavigate } from "react-router-dom";

const FeaturedPizzas = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const featuredPizzas = pizzas.filter(
    (pizza) => pizza.featured,
  );

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

  const handleViewFullMenu = () => {
    navigate("/menu");
  };

  return (
    <section
      className="bg-white px-6 py-24"
      id="menu"
    >
      <div className="mx-auto max-w-6xl">
        {/* Heading */}
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="mb-3 text-sm font-bold tracking-[4px] text-pizzaro-red">
              OUR FAVORITES
            </p>

            <h2 className="font-display text-4xl font-bold tracking-tight text-pizzaro-dark md:text-5xl">
              Made for pizza lovers.
            </h2>

            <p className="mt-3 max-w-lg text-pizzaro-muted">
              Handcrafted pizzas made with fresh ingredients
              and plenty of flavour.
            </p>
          </div>

          {/* Desktop */}
          <button
            type="button"
            onClick={handleViewFullMenu}
            className="hidden rounded-full border border-gray-200 px-5 py-2.5 text-sm font-semibold text-pizzaro-dark transition hover:border-pizzaro-red hover:text-pizzaro-red md:block"
          >
            View Full Menu →
          </button>
        </div>

        {/* Pizza cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {featuredPizzas.map((pizza) => (
            <article
              key={pizza.id}
              className="group overflow-hidden rounded-pizzaro border border-black/5 bg-pizzaro-cream transition-all duration-500 hover:-translate-y-2 hover:shadow-pizzaro-lg"
            >
              {/* Image */}
              <div className="relative flex h-72 items-center justify-center overflow-hidden bg-[#f5e8dc]">
                <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/5" />

                <img
                  src={pizza.image}
                  alt={pizza.name}
                  className="relative h-full w-full object-contain p-5 transition duration-500 group-hover:scale-110"
                />

                {/* Price */}
                <div className="absolute right-4 top-4 rounded-full bg-white px-4 py-2 text-sm font-bold text-pizzaro-red shadow-md">
                  ₹{pizza.price}
                </div>
              </div>

              {/* Details */}
              <div className="p-6">
                <h3 className="font-display text-2xl font-bold text-pizzaro-dark">
                  {pizza.name}
                </h3>

                <p className="mt-2 min-h-12 text-sm leading-6 text-pizzaro-muted">
                  {pizza.description}
                </p>

                <button
                  type="button"
                  onClick={() => handleAddToCart(pizza)}
                  className="mt-5 w-full rounded-full bg-pizzaro-dark py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-pizzaro-red hover:shadow-lg"
                >
                  Add to Cart
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Mobile */}
        <button
          type="button"
          onClick={handleViewFullMenu}
          className="mt-8 w-full rounded-full border border-gray-200 px-5 py-3 text-sm font-semibold text-pizzaro-dark transition hover:border-pizzaro-red hover:text-pizzaro-red md:hidden"
        >
          View Full Menu →
        </button>
      </div>
    </section>
  );
};

export default FeaturedPizzas;