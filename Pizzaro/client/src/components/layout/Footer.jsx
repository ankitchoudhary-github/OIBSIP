const Footer = () => {
  return (
    <footer className="bg-pizzaro-dark px-6 py-16 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-3">

          <div>
            <h2 className="font-display text-3xl font-bold">
              Pizzaro<span className="text-pizzaro-red">.</span>
            </h2>

            <p className="mt-4 max-w-sm text-sm leading-6 text-white/60">
              Pizza made your way. Fresh ingredients, bold
              flavours, and endless possibilities.
            </p>
          </div>

          <div>
            <h3 className="font-semibold">
              Explore
            </h3>

            <div className="mt-4 space-y-3 text-sm text-white/60">
              <a href="#menu" className="block hover:text-white">
                Menu
              </a>

              <a
                href="#customize"
                className="block hover:text-white"
              >
                Customize
              </a>

              <a
                href="#how-it-works"
                className="block hover:text-white"
              >
                How it works
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold">
              Get in touch
            </h3>

            <div className="mt-4 space-y-3 text-sm text-white/60">
              <p>+91 9773834445</p>
              <p>itschoudharyankitgmail.com</p>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-sm text-white/40">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} Pizzaro. All rights reserved.
            </p>

            <p>
              Created by{" "}
              <span className="font-semibold text-white">
                Ankit Choudhary
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;