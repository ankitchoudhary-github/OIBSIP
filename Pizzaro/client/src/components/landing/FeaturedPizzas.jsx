const pizzas = [
  {
    name: "BBQ Poncho",
    description: "Smoky BBQ sauce, tender chicken & melted cheese.",
    price: "₹399",
    image: "/images/bbq poncho.png",
  },
  {
    name: "Bombay",
    description: "A bold Indian-inspired pizza packed with flavour.",
    price: "₹349",
    image: "/images/bombay.png",
  },
  {
    name: "Cheeseburger Pizza",
    description: "All the comfort of a cheeseburger on a pizza.",
    price: "₹449",
    image: "/images/cheeseburger pizza.png",
  },
];

const FeaturedPizzas = () => {
  return (
    <section className="bg-white px-6 py-24">
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
              Handcrafted pizzas made with fresh ingredients and plenty of
              flavour.
            </p>
          </div>

          <button className="hidden rounded-full border border-gray-200 px-5 py-2.5 text-sm font-semibold text-pizzaro-dark transition hover:border-pizzaro-red hover:text-pizzaro-red md:block">
            View Full Menu →
          </button>
        </div>

        {/* Pizza cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {pizzas.map((pizza) => (
            <article
              key={pizza.name}
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

                {/* Price badge */}
                <div className="absolute right-4 top-4 rounded-full bg-white px-4 py-2 text-sm font-bold text-pizzaro-red shadow-md">
                  {pizza.price}
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

                <button className="mt-5 w-full rounded-full bg-pizzaro-dark py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-pizzaro-red hover:shadow-lg">
                  Add to Cart
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Mobile button */}
        <button className="mt-8 w-full rounded-full border border-gray-200 px-5 py-3 text-sm font-semibold text-pizzaro-dark transition hover:border-pizzaro-red hover:text-pizzaro-red md:hidden">
          View Full Menu →
        </button>
      </div>
    </section>
  );
};

export default FeaturedPizzas;