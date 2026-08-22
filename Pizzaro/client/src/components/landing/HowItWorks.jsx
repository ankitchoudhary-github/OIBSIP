import {
  ArrowRight,
  Check,
  CreditCard,
  Pizza,
  ShoppingBag,
} from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

const steps = [
  {
    number: "01",
    icon: Pizza,
    title: "Pick your pizza",
    description:
      "Choose from our handcrafted classics made with fresh ingredients.",
  },
  {
    number: "02",
    icon: Check,
    title: "Make it yours",
    description:
      "Build your own pizza with your preferred base, sauce, cheese, and toppings.",
  },
  {
    number: "03",
    icon: ShoppingBag,
    title: "Add to cart",
    description:
      "Review your pizzas, adjust quantities, and check your order total.",
  },
  {
    number: "04",
    icon: CreditCard,
    title: "We make & deliver",
    description:
      "Confirm your delivery details, complete payment, and we'll get your pizza on its way.",
  },
];

const HowItWorks = () => {
  const navigate = useNavigate();

  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden bg-pizzaro-cream px-6 py-24"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-20 h-80 w-80 rounded-full bg-pizzaro-red/5 blur-3xl" />

        <div className="absolute -right-40 bottom-10 h-80 w-80 rounded-full bg-pizzaro-orange/10 blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #111 1px, transparent 1px), linear-gradient(to bottom, #111 1px, transparent 1px)",
            backgroundSize: "42px 42px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="mb-3 text-sm font-bold uppercase tracking-[4px] text-pizzaro-red">
            HOW IT WORKS
          </p>

          <h2 className="font-display text-4xl font-bold tracking-tight text-pizzaro-dark md:text-5xl lg:text-6xl">
            Pizza, your way.
            <span className="text-pizzaro-red">
              {" "}
              Made easy.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-pizzaro-muted">
            From choosing a classic to creating your own,
            getting your perfect pizza is just a few simple steps.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Connecting line on desktop */}
          <div className="pointer-events-none absolute left-[12%] right-[12%] top-14.5 hidden h-px bg-black/10 lg:block" />

          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.number}
                initial={{
                  opacity: 0,
                  y: 25,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.15,
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                }}
                className="relative z-10"
              >
                <div className="h-full rounded-3xl border border-black/5 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-pizzaro-lg">
                  {/* Number + icon */}
                  <div className="flex items-center justify-between">
                    <span className="font-display text-sm font-bold tracking-[2px] text-pizzaro-red">
                      {step.number}
                    </span>

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pizzaro-cream text-pizzaro-red">
                      <Icon size={22} />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="mt-7 font-display text-2xl font-bold text-pizzaro-dark">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-pizzaro-muted">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-14 flex flex-col items-center justify-center gap-4 text-center sm:flex-row"
        >
          <p className="text-sm text-pizzaro-muted">
            Ready to order something delicious?
          </p>

          <button
            type="button"
            onClick={() => navigate("/menu")}
            className="group flex items-center gap-2 rounded-full bg-pizzaro-red px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-pizzaro-red/20 transition hover:-translate-y-0.5 hover:bg-pizzaro-red-dark hover:shadow-xl"
          >
            Browse the Menu

            <ArrowRight
              size={17}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;