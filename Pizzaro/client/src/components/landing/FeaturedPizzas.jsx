import { useCart } from "../../context/CartContext";

const pizzas = [
  {
    id: "menu-bbq-poncho",
    name: "BBQ Poncho",
    description: "Smoky BBQ sauce, tender chicken & melted cheese.",
    price: 399,
    image: "/images/menu/bbq poncho.png",
  },
  {
    id: "menu-bombay",
    name: "Bombay",
    description: "A bold Indian-inspired pizza packed with flavour.",
    price: 349,
    image: "/images/menu/bombay.png",
  },
  {
    id: "menu-cheeseburger-pizza",
    name: "Cheeseburger Pizza",
    description: "All the comfort of a cheeseburger on a pizza.",
    price: 449,
    image: "/images/menu/cheeseburger pizza.png",
  },
  {
    id: "menu-chicken-teriyaki",
    name: "Chicken Teriyaki",
    description: "Tender chicken with sweet and savoury teriyaki flavours.",
    price: 449,
    image: "/images/menu/Chicken_Teriyaki.png",
  },
  {
    id: "menu-conchita",
    name: "Conchita",
    description: "A rich, flavour-packed pizza crafted for bold tastes.",
    price: 429,
    image: "/images/menu/conchita.png",
  },
  {
    id: "menu-dutchman",
    name: "Dutchman",
    description: "A hearty combination of premium toppings and melted cheese.",
    price: 439,
    image: "/images/menu/dutchman.png",
  },
  {
    id: "menu-gourmet",
    name: "Gourmet",
    description: "A premium pizza layered with rich flavours and fresh ingredients.",
    price: 479,
    image: "/images/menu/Gourmet.png",
  },
  {
    id: "menu-steak-bacon",
    name: "Steak & Bacon",
    description: "Juicy steak, crispy bacon and melted cheese on a golden crust.",
    price: 499,
    image: "/images/menu/steak&bacon.png",
  },
  {
    id: "menu-indi-tandoor",
    name: "Indian Tandoori Paneer",
    description: "Classic dough base with rich tandoori-marinated paneer, herbs and spices.",
    price: 600,
    image: "/images/menu/indi-tandoor.png",
  },
];

const FeaturedPizzas = () => {
  const { addToCart } = useCart();

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
    <section className="bg-white px-6 py-24" id="menu">
      <div className="mx-auto max-w-6xl">

        {/* Heading */}
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="mb-3 text-sm font-bold tracking-[4px] text-pizzaro-red">
              OUR FAVORITES
            </p>

            <h2 className="font-display text-4xl font-bold tracking-tight text-pizzaro-dark md:text-5xl" >
              Made for pizza lovers.
            </h2>

            <p className="mt-3 max-w-lg text-pizzaro-muted">
              Handcrafted pizzas made with fresh ingredients and plenty of
              flavour.
            </p>
          </div>
        </div>

        {/* Pizza cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {pizzas.map((pizza) => (
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

                {/* Price badge */}
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

        {/* Mobile button */}
        <button
          type="button"
          className="mt-8 w-full rounded-full border border-gray-200 px-5 py-3 text-sm font-semibold text-pizzaro-dark transition hover:border-pizzaro-red hover:text-pizzaro-red md:hidden"
        >
          View Full Menu →
        </button>
      </div>
    </section>
  );
};

export default FeaturedPizzas;