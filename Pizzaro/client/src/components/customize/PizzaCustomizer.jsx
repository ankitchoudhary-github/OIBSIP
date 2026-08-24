import { useMemo, useState } from "react";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { useCart } from "../../context/useCart";

const steps = [
  {
    id: "base",
    number: 1,
    title: "Pizza Base",
  },
  {
    id: "sauce",
    number: 2,
    title: "Sauce",
  },
  {
    id: "cheese",
    number: 3,
    title: "Cheese",
  },
  {
    id: "vegetables",
    number: 4,
    title: "Vegetables",
  },
];

const bases = [
  {
    name: "Classic",
    description: "Our signature hand-stretched base",
    price: 299,
    image: "/images/customizer/bases/classic-crust.png",
  },
  {
    name: "Thin Crust",
    description: "Light, crispy & perfectly golden",
    price: 329,
    image: "/images/customizer/bases/thin-crust.png",
  },
  {
    name: "Whole Wheat",
    description: "Wholesome & hearty",
    price: 339,
    image: "/images/customizer/bases/whole-wheat.png",
  },
  {
    name: "Cheese Burst",
    description: "Loaded with creamy cheese",
    price: 369,
    image: "/images/customizer/bases/cheese-burst.png",
  },
  {
    name: "Stuffed Crust",
    description: "Golden crust packed with cheese",
    price: 389,
    image: "/images/customizer/bases/stuffed-crust.png",
  },
];

const sauces = [
  {
    name: "Classic Tomato",
    description: "Rich Italian tomato sauce",
    price: 0,
    image: "/images/customizer/sauces/classic-tomato.png",
  },
  {
    name: "BBQ",
    description: "Smoky, sweet & tangy",
    price: 20,
    image: "/images/customizer/sauces/BBQ.png",
  },
  {
    name: "Spicy Arrabbiata",
    description: "Tomato sauce with a kick",
    price: 25,
    image: "/images/customizer/sauces/spicy-arrabbiata.png",
  },
  {
    name: "Creamy Garlic",
    description: "Smooth garlic cream sauce",
    price: 30,
    image: "/images/customizer/sauces/creamy-garlic.png",
  },
  {
    name: "Pesto",
    description: "Fresh basil & parmesan",
    price: 35,
    image: "/images/customizer/sauces/pesto.png",
  },
];

const cheeses = [
  {
    name: "Mozzarella",
    description: "Classic stretchy mozzarella",
    price: 0,
    image: "/images/customizer/cheeses/mozzarella.png",
  },
  {
    name: "Cheddar",
    description: "Sharp & rich",
    price: 30,
    image: "/images/customizer/cheeses/cheddar.png",
  },
  {
    name: "Parmesan",
    description: "Nutty & aged",
    price: 40,
    image: "/images/customizer/cheeses/parmesan.png",
  },
  {
    name: "Four Cheese",
    description: "A decadent cheese blend",
    price: 60,
    image: "/images/customizer/cheeses/four-cheese.png",
  },
];

const vegetables = [
  {
    name: "Onions",
    price: 20,
    image: "/images/customizer/toppings/onions.png",
  },
  {
    name: "Capsicum",
    price: 20,
    image: "/images/customizer/toppings/capsicum.png",
  },
  {
    name: "Mushrooms",
    price: 30,
    image: "/images/customizer/toppings/mushrooms.png",
  },
  {
    name: "Black Olives",
    price: 30,
    image: "/images/customizer/toppings/black-olives.png",
  },
  {
    name: "Jalapeños",
    price: 30,
    image: "/images/customizer/toppings/jalapenos.png",
  },
  {
    name: "Sweet Corn",
    price: 25,
    image: "/images/customizer/toppings/sweet-corn.png",
  },
  {
    name: "Tomatoes",
    price: 20,
    image: "/images/customizer/toppings/tomatoes.png",
  },
  {
    name: "Spinach",
    price: 25,
    image: "/images/customizer/toppings/spinach.png",
  },
];

const toOptionId = (value) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

const PizzaCustomizer = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const [selectedBase, setSelectedBase] = useState("Classic");
  const [selectedSauce, setSelectedSauce] = useState("Classic Tomato");
  const [selectedCheese, setSelectedCheese] = useState("Mozzarella");
  const [selectedVegetables, setSelectedVegetables] = useState([]);

  const { addToCart } = useCart();

  const toggleVegetable = (vegetable) => {
    setSelectedVegetables((current) =>
      current.includes(vegetable)
        ? current.filter((item) => item !== vegetable)
        : [...current, vegetable],
    );
  };

  const totalPrice = useMemo(() => {
    const base =
      bases.find((item) => item.name === selectedBase)?.price ?? 299;

    const sauce =
      sauces.find((item) => item.name === selectedSauce)?.price ?? 0;

    const cheese =
      cheeses.find((item) => item.name === selectedCheese)?.price ?? 0;

    const vegetablesPrice = selectedVegetables.reduce(
      (total, vegetable) => {
        const item = vegetables.find(
          (entry) => entry.name === vegetable
        );

        return total + (item?.price ?? 0);
      },
      0
    );

    return base + sauce + cheese + vegetablesPrice;
  }, [
    selectedBase,
    selectedSauce,
    selectedCheese,
    selectedVegetables,
  ]);

  const createCustomPizzaId = () => {
    return [
      "custom",
      toOptionId(selectedBase),
      toOptionId(selectedSauce),
      toOptionId(selectedCheese),
      ...[...selectedVegetables]
        .map(toOptionId)
        .sort(),
    ].join("|");
  };

 const handleAddToCart = () => {
  addToCart({
    id: createCustomPizzaId(),

    type: "custom",

    name: `${selectedBase} Pizza`,

    image: "/images/menu/customizer-pizza.png",

    // Backend identifiers
    baseId: toOptionId(selectedBase),
    sauceId: toOptionId(selectedSauce),
    cheeseId: toOptionId(selectedCheese),
    vegetableIds: [...selectedVegetables]
      .map(toOptionId)
      .sort(),

    // UI display values
    base: selectedBase,
    sauce: selectedSauce,
    cheese: selectedCheese,
    vegetables: [...selectedVegetables],

    // Display-only price
    price: totalPrice,

    quantity: 1,
  });

  setSelectedBase("Classic");
  setSelectedSauce("Classic Tomato");
  setSelectedCheese("Mozzarella");
  setSelectedVegetables([]);
  setCurrentStep(0);
};


  const canGoNext = currentStep < steps.length - 1;
  const canGoBack = currentStep > 0;

  const nextStep = () => {
    if (canGoNext) {
      setCurrentStep((step) => step + 1);
    }
  };

  const previousStep = () => {
    if (canGoBack) {
      setCurrentStep((step) => step - 1);
    }
  };

  return (
    <section
      id="customize"
      className="overflow-hidden bg-pizzaro-cream px-6 py-24"
    >
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="mb-3 text-sm font-bold tracking-[4px] text-pizzaro-red">
            MAKE IT YOURS
          </p>

          <h2 className="font-display text-4xl font-bold tracking-tight text-pizzaro-dark md:text-6xl">
            Build your perfect pizza.
          </h2>

          <p className="mt-5 text-lg leading-8 text-pizzaro-muted">
            Four simple steps. Endless possibilities.
          </p>
        </div>

        {/* Progress */}
        <div className="mx-auto mb-12 max-w-4xl">
          <div className="relative">
            <div className="absolute left-0 right-0 top-5 h-px bg-black/10" />

            <div
              className="absolute left-0 top-5 h-px bg-pizzaro-red transition-all duration-500"
              style={{
                width: `${(currentStep / (steps.length - 1)) * 100}%`,
              }}
            />

            <div className="relative flex justify-between">
              {steps.map((step, index) => {
                const completed = index < currentStep;
                const active = index === currentStep;

                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setCurrentStep(index)}
                    className="flex flex-col items-center gap-3"
                  >
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-bold transition-all duration-300 ${active || completed
                        ? "border-pizzaro-red bg-pizzaro-red text-white shadow-lg"
                        : "border-black/10 bg-pizzaro-cream text-pizzaro-muted"
                        }`}
                    >
                      {completed ? <Check size={17} /> : step.number}
                    </span>

                    <span
                      className={`hidden text-sm font-semibold sm:block ${active
                        ? "text-pizzaro-red"
                        : "text-pizzaro-muted"
                        }`}
                    >
                      {step.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main builder */}
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Preview */}
          <div className="relative min-h-135 overflow-hidden rounded-4xl bg-[#f4e4d6]">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-pizzaro-orange/20 blur-3xl" />

            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-pizzaro-red/10 blur-3xl" />

            <div className="relative flex h-full min-h-135 flex-col items-center justify-center p-8">
              <p className="mb-8 text-xs font-bold uppercase tracking-[3px] text-pizzaro-muted">
                Your creation
              </p>

              <div className="relative">
                <div className="absolute inset-6 rounded-full bg-black/10 blur-2xl" />

                <img
                  src="/images/menu/customizer-pizza.png"
                  alt="Pizza preview"
                  className="relative h-64 w-64 object-contain drop-shadow-2xl transition-all duration-500 sm:h-80 sm:w-80"
                />
              </div>

              <div className="mt-8 text-center">
                <h3 className="font-display text-2xl font-bold text-pizzaro-dark">
                  {selectedBase} Pizza
                </h3>

                <p className="mt-2 text-sm text-pizzaro-muted">
                  {selectedSauce} · {selectedCheese}
                </p>

                {selectedVegetables.length > 0 && (
                  <p className="mt-2 max-w-sm text-xs text-pizzaro-muted">
                    {selectedVegetables.join(" · ")}
                  </p>
                )}
              </div>

              <div className="mt-7 rounded-full bg-white px-6 py-3 shadow-sm">
                <span className="text-sm text-pizzaro-muted">
                  Total
                </span>

                <span className="ml-2 font-display text-xl font-bold text-pizzaro-dark">
                  ₹{totalPrice}
                </span>
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="rounded-4xl bg-white p-6 shadow-pizzaro sm:p-8">
            {/* Step 1 */}
            {currentStep === 0 && (
              <div>
                <div className="mb-7">
                  <span className="text-sm font-semibold text-pizzaro-red">
                    STEP 01
                  </span>

                  <h3 className="mt-1 font-display text-3xl font-bold text-pizzaro-dark">
                    Choose your base
                  </h3>

                  <p className="mt-2 text-pizzaro-muted">
                    Start with the foundation of your pizza.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {bases.map((base) => {
                    const selected = selectedBase === base.name;

                    return (
                      <button
                        key={base.name}
                        type="button"
                        onClick={() => setSelectedBase(base.name)}
                        className={`group rounded-2xl border p-4 text-left transition-all duration-300 ${selected
                          ? "border-pizzaro-red bg-pizzaro-red/5 shadow-md"
                          : "border-black/10 hover:-translate-y-0.5 hover:border-pizzaro-red/40 hover:shadow-sm"
                          }`}
                      >
                        {/* Image */}
                        <div className="mb-4 flex h-32 items-center justify-center overflow-hidden rounded-xl bg-[#f5e8dc]">
                          <img
                            src={base.image}
                            alt={base.name}
                            className="h-full w-full object-contain p-3 transition duration-300 group-hover:scale-105"
                          />
                        </div>

                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h4 className="font-semibold text-pizzaro-dark">
                              {base.name}
                            </h4>

                            <p className="mt-1 text-sm leading-5 text-pizzaro-muted">
                              {base.description}
                            </p>
                          </div>

                          <span
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${selected
                              ? "border-pizzaro-red bg-pizzaro-red text-white"
                              : "border-black/10"
                              }`}
                          >
                            {selected && <Check size={13} />}
                          </span>
                        </div>

                        <p className="mt-4 text-sm font-bold text-pizzaro-red">
                          ₹{base.price}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 2 */}
            {currentStep === 1 && (
              <div>
                <div className="mb-7">
                  <span className="text-sm font-semibold text-pizzaro-red">
                    STEP 02
                  </span>

                  <h3 className="mt-1 font-display text-3xl font-bold text-pizzaro-dark">
                    Choose your sauce
                  </h3>

                  <p className="mt-2 text-pizzaro-muted">
                    Give your pizza its signature flavour.
                  </p>
                </div>

                <div className="space-y-3">
                  {sauces.map((sauce) => {
                    const selected = selectedSauce === sauce.name;

                    return (
                      <button
                        key={sauce.name}
                        type="button"
                        onClick={() => setSelectedSauce(sauce.name)}
                        className={`group flex w-full items-center gap-5 rounded-2xl border p-4 text-left transition-all duration-300 ${selected
                          ? "border-pizzaro-red bg-pizzaro-red/5"
                          : "border-black/10 hover:border-pizzaro-red/40"
                          }`}
                      >
                        {/* Sauce image */}
                        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#f5e8dc]">
                          <img
                            src={sauce.image}
                            alt={sauce.name}
                            className="h-full w-full object-contain p-1 transition duration-300 group-hover:scale-105"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <h4 className="font-semibold text-pizzaro-dark">
                            {sauce.name}
                          </h4>

                          <p className="mt-1 text-sm text-pizzaro-muted">
                            {sauce.description}
                          </p>
                        </div>

                        <div className="flex shrink-0 items-center gap-4">
                          <span className="text-sm font-bold text-pizzaro-red">
                            {sauce.price === 0
                              ? "Included"
                              : `+₹${sauce.price}`}
                          </span>

                          <span
                            className={`flex h-6 w-6 items-center justify-center rounded-full border ${selected
                              ? "border-pizzaro-red bg-pizzaro-red text-white"
                              : "border-black/10"
                              }`}
                          >
                            {selected && <Check size={13} />}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 3 */}
            {currentStep === 2 && (
              <div>
                <div className="mb-7">
                  <span className="text-sm font-semibold text-pizzaro-red">
                    STEP 03
                  </span>

                  <h3 className="mt-1 font-display text-3xl font-bold text-pizzaro-dark">
                    Choose your cheese
                  </h3>

                  <p className="mt-2 text-pizzaro-muted">
                    Finish it with your favourite cheese.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {cheeses.map((cheese) => {
                    const selected = selectedCheese === cheese.name;

                    return (
                      <button
                        key={cheese.name}
                        type="button"
                        onClick={() => setSelectedCheese(cheese.name)}
                        className={`group rounded-2xl border p-4 text-left transition-all duration-300 ${selected
                          ? "border-pizzaro-red bg-pizzaro-red/5 shadow-md"
                          : "border-black/10 hover:-translate-y-0.5 hover:border-pizzaro-red/40"
                          }`}
                      >
                        {/* Cheese image */}
                        <div className="mb-4 flex h-28 items-center justify-center overflow-hidden rounded-xl bg-[#f5e8dc]">
                          <img
                            src={cheese.image}
                            alt={cheese.name}
                            className="h-full w-full object-contain p-2 transition duration-300 group-hover:scale-105"
                          />
                        </div>

                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h4 className="font-semibold text-pizzaro-dark">
                              {cheese.name}
                            </h4>

                            <p className="mt-1 text-sm text-pizzaro-muted">
                              {cheese.description}
                            </p>
                          </div>

                          <span
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${selected
                              ? "border-pizzaro-red bg-pizzaro-red text-white"
                              : "border-black/10"
                              }`}
                          >
                            {selected && <Check size={13} />}
                          </span>
                        </div>

                        <p className="mt-4 text-sm font-bold text-pizzaro-red">
                          {cheese.price === 0
                            ? "Included"
                            : `+₹${cheese.price}`}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 4 */}
            {currentStep === 3 && (
              <div>
                <div className="mb-7">
                  <span className="text-sm font-semibold text-pizzaro-red">
                    STEP 04
                  </span>

                  <h3 className="mt-1 font-display text-3xl font-bold text-pizzaro-dark">
                    Add your vegetables
                  </h3>

                  <p className="mt-2 text-pizzaro-muted">
                    Pick as many as you like.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {vegetables.map((vegetable) => {
                    const selected = selectedVegetables.includes(
                      vegetable.name
                    );

                    return (
                      <button
                        key={vegetable.name}
                        type="button"
                        onClick={() => toggleVegetable(vegetable.name)}
                        className={`group flex items-center gap-4 rounded-2xl border p-3 text-left transition-all duration-300 ${selected
                          ? "border-pizzaro-red bg-pizzaro-red/5 shadow-sm"
                          : "border-black/10 hover:border-pizzaro-red/40"
                          }`}
                      >
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#f5e8dc]">
                          <img
                            src={vegetable.image}
                            alt={vegetable.name}
                            className="h-full w-full object-contain p-1 transition duration-300 group-hover:scale-110"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <h4 className="font-semibold text-pizzaro-dark">
                            {vegetable.name}
                          </h4>

                          <p className="mt-1 text-xs font-semibold text-pizzaro-red">
                            +₹{vegetable.price}
                          </p>
                        </div>

                        <span
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${selected
                            ? "border-pizzaro-red bg-pizzaro-red text-white"
                            : "border-black/10"
                            }`}
                        >
                          {selected && <Check size={13} />}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-10 flex items-center justify-between border-t border-black/5 pt-6">
              <button
                type="button"
                onClick={previousStep}
                disabled={!canGoBack}
                className="flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-pizzaro-dark transition hover:bg-black/5 disabled:pointer-events-none disabled:opacity-30"
              >
                <ChevronLeft size={18} />
                Back
              </button>

              {canGoNext ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center gap-2 rounded-full bg-pizzaro-red px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-pizzaro-red/20 transition hover:bg-pizzaro-red-dark hover:shadow-xl"
                >
                  Continue
                  <ChevronRight size={18} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex items-center gap-2 rounded-full bg-pizzaro-dark px-6 py-3 text-sm font-semibold text-white transition hover:bg-pizzaro-red"
                >
                  Add to Cart
                  <ChevronRight size={18} />

                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PizzaCustomizer;