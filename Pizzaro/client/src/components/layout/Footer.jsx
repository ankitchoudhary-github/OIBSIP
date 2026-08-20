const Footer = () => {
  return (
    <footer className="bg-pizzaro-dark px-6 py-16 text-white">
      <div className="mx-auto max-w-7xl">

        <div className="grid gap-10 md:grid-cols-3">

          {/* Brand */}
          <div>
            <h2 className="font-display text-3xl font-bold">
              Pizzaro
              <span className="text-pizzaro-red">.</span>
            </h2>

            <p className="mt-4 max-w-sm text-sm leading-6 text-white/60">
              Pizza made your way. Fresh ingredients, bold
              flavours, and endless possibilities.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="font-semibold">
              Explore
            </h3>

            <div className="mt-4 space-y-3 text-sm text-white/60">
              <a
                href="#menu"
                className="block transition hover:text-white"
              >
                Menu
              </a>

              <a
                href="#customize"
                className="block transition hover:text-white"
              >
                Customize
              </a>

              <a
                href="#how-it-works"
                className="block transition hover:text-white"
              >
                How it works
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold">
              Get in touch
            </h3>

            <div className="mt-4 space-y-3 text-sm text-white/60">
              {/* Phone */}
              <a
                href="tel:+919773834445"
                className="block transition hover:text-white"
              >
                +91 9773834445
              </a>

              {/* Email */}
              <a
                href="mailto:itschoudharyankit@gmail.com"
                className="block transition hover:text-white"
              >
                itschoudharyankit@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-white/10 pt-6 text-sm text-white/40">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <p>
              © {new Date().getFullYear()} Pizzaro.
              All rights reserved.
            </p>

            <p>
              Created by{" "}
              <a
                href="https://www.linkedin.com/in/itsankitchoudhary/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-white transition hover:text-pizzaro-red"
              >
                Ankit Choudhary
              </a>
            </p>

          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;