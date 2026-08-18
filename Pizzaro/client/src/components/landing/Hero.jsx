import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="min-h-[calc(100vh-100px)] flex items-center justify-center px-6 py-20 text-center">
      <div className="max-w-4xl">
        <p className="mb-3.5 text-sm font-bold tracking-[5px] text-pizzaro-red">
          WELCOME TO
        </p>

        <h1 className="m-0 font-display text-7xl font-extrabold leading-[0.95] tracking-[-5px] text-pizzaro-dark md:text-8xl lg:text-[120px]">
          Pizzaro<span className="text-pizzaro-red">.</span>
        </h1>

        <p className="my-6 text-xl text-pizzaro-muted">
          Pizza delivered your way.
        </p>

        <div className="flex justify-center gap-3.5">
          <button className="flex items-center gap-2.5 rounded-full bg-pizzaro-red px-7 py-4 font-semibold text-white transition hover:-translate-y-0.5">
            Start Ordering
            <ArrowRight size={18} />
          </button>

          <button className="rounded-full border border-gray-200 bg-white px-7 py-4 font-semibold text-pizzaro-dark transition hover:border-gray-400">
            Explore Menu
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;