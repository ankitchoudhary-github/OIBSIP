import { motion } from "motion/react";
import { ShoppingBag, Menu } from "lucide-react";
import Button from "../ui/Button";

function Navbar() {
  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed left-0 right-0 top-0 z-50 px-6 py-5"
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-pizzaro-dark/5 bg-white/80 px-5 py-3 shadow-sm backdrop-blur-xl">
        
        {/* Logo */}
        <a
          href="/"
          className="font-display text-2xl font-bold tracking-tight text-pizzaro-dark"
        >
          Pizzaro<span className="text-pizzaro-red">.</span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          <a
            href="#menu"
            className="text-sm font-medium text-pizzaro-muted transition-colors hover:text-pizzaro-red"
          >
            Menu
          </a>

          <a
            href="#customize"
            className="text-sm font-medium text-pizzaro-muted transition-colors hover:text-pizzaro-red"
          >
            Customize
          </a>

          <a
            href="#how-it-works"
            className="text-sm font-medium text-pizzaro-muted transition-colors hover:text-pizzaro-red"
          >
            How it works
          </a>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-pizzaro-dark text-white"
            aria-label="Shopping cart"
          >
            <ShoppingBag size={18} strokeWidth={2} />

            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-pizzaro-red px-1 text-[10px] font-bold">
              0
            </span>
          </motion.button>

          <Button size="sm" className="hidden sm:inline-flex">
            Sign In
          </Button>

          <button
            className="flex h-10 w-10 items-center justify-center rounded-full border border-pizzaro-dark/10 md:hidden"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </nav>
    </motion.header>
  );
}

export default Navbar;