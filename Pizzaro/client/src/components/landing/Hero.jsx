import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "motion/react";

const Hero = () => {
  return (
    <section className="relative isolate min-h-[calc(100vh-100px)] overflow-hidden bg-pizzaro-cream px-6 pb-20 pt-32 lg:pt-36">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {/* Large warm glow */}
        <div className="absolute -right-40 top-10 h-130 w-130 rounded-full bg-pizzaro-orange/15 blur-3xl" />

        {/* Soft red glow */}
        <div className="absolute -left-40 bottom-0 h-105 w-105 rounded-full bg-pizzaro-red/10 blur-3xl" />

        {/* Decorative circles */}
        <div className="absolute right-[20%] top-[18%] h-20 w-20 rounded-full border border-pizzaro-red/10" />

        <div className="absolute left-[8%] top-[28%] h-3 w-3 rounded-full bg-pizzaro-red/40" />

        <div className="absolute left-[13%] top-[21%] h-2 w-2 rounded-full bg-pizzaro-orange/50" />

        <div className="absolute right-[12%] bottom-[18%] h-4 w-4 rounded-full bg-pizzaro-orange/40" />

        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #111 1px, transparent 1px), linear-gradient(to bottom, #111 1px, transparent 1px)",
            backgroundSize: "42px 42px",
          }}
        />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-4">
        {/* Left content */}
        <div className="relative z-10 max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mb-4 text-sm font-bold uppercase tracking-[5px] text-pizzaro-red"
          >
            WELCOME TO PIZZARO
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-6xl font-extrabold leading-[0.92] tracking-[-4px] text-pizzaro-dark sm:text-7xl md:text-8xl lg:text-[96px]"
          >
            Your pizza.
            <br />
            <span className="text-pizzaro-red">
              Your rules.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-7 max-w-xl text-lg leading-8 text-pizzaro-muted md:text-xl"
          >
            Pick your favourite, build your own, and make every
            bite exactly how you like it.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-9 flex flex-wrap gap-3"
          >
            <button
              type="button"
              onClick={() => {
                document
                  .getElementById("menu")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  });
              }}
              className="group flex items-center gap-2.5 rounded-full bg-pizzaro-red px-7 py-4 font-semibold text-white shadow-lg shadow-pizzaro-red/20 transition duration-300 hover:-translate-y-0.5 hover:bg-pizzaro-red-dark hover:shadow-xl"
            >
              Start Ordering

              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>

            <button
              type="button"
              onClick={() => {
                document
                  .getElementById("customize")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  });
              }}
              className="rounded-full border border-pizzaro-dark/10 bg-white/80 px-7 py-4 font-semibold text-pizzaro-dark shadow-sm backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-pizzaro-dark/20 hover:bg-white"
            >
              Build Your Pizza
            </button>
          </motion.div>

          {/* Small reassurance row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-pizzaro-muted"
          >
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-pizzaro-green" />
              Fresh ingredients
            </span>

            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-pizzaro-orange" />
              Made to order
            </span>

            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-pizzaro-red" />
              Customizable
            </span>
          </motion.div>
        </div>

        {/* Pizza visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, x: 30 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.15,
            ease: "easeOut",
          }}
          className="relative flex min-h-115 translate-y-8 items-center justify-center lg:min-h-155 lg:translate-y-12"
        >
          {/* Decorative plate/glow */}
          <div className="absolute h-77 w-77 rounded-full bg-white/70 shadow-[0_30px_80px_rgba(0,0,0,0.08)] sm:h-97.5 sm:w-97.5 lg:h-112.5 lg:w-112.5" />

          <div className="absolute h-56.25 w-56.25 rounded-full border border-pizzaro-red/10 sm:h-75 sm:w-75 lg:h-91.25 lg:w-91.25" />

          {/* Pizza */}
          <motion.img
            src="/images/menu/customizer-pizza.png"
            alt="Freshly prepared Pizzaro pizza"
            className="relative z-10 w-75 object-contain drop-shadow-[0_30px_30px_rgba(0,0,0,0.18)] sm:w-95 lg:w-117.5"
            animate={{
              y: [0, -8, 0],
              rotate: [-1, 1, -1],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Floating label */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.4 }}
            className="absolute right-0 top-[18%] z-20 rounded-2xl border border-black/5 bg-white/90 px-4 py-3 shadow-lg backdrop-blur sm:right-[4%]"
          >
            <p className="text-[10px] font-bold uppercase tracking-[2px] text-pizzaro-red">
              Fan favourite
            </p>

            <p className="mt-1 font-display text-lg font-bold text-pizzaro-dark">
              Bombay
            </p>
          </motion.div>

          {/* Floating customization badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.4 }}
            className="absolute bottom-[12%] left-0 z-20 rounded-2xl bg-pizzaro-dark px-5 py-4 text-white shadow-xl sm:left-[4%]"
          >
            <p className="text-xs text-white/60">
              Make it yours
            </p>

            <p className="mt-1 font-display text-xl font-bold">
              Choose your toppings
            </p>
          </motion.div>

          {/* Tiny decorative dots */}
          <span className="absolute left-[14%] top-[18%] h-3 w-3 rounded-full bg-pizzaro-red" />

          <span className="absolute right-[18%] bottom-[22%] h-4 w-4 rounded-full bg-pizzaro-orange" />
        </motion.div>
      </div>

      {/* Bottom transition */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-28 bg-linear-to-t from-white/80 to-transparent" />
    </section>
  );
};

export default Hero;