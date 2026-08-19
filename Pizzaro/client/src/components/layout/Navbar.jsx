import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ShoppingBag, Menu } from "lucide-react";

import Button from "../ui/Button";
import CartDrawer from "../cart/CartDrawer";
import { useCart } from "../../context/CartContext";

export const CART_OPEN_EVENT = "pizzaro:open-cart";

function Navbar() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { totalItems } = useCart();

  useEffect(() => {
    const handleCartEvent = () => {
      setIsCartOpen(true);
    };

    window.addEventListener(
      CART_OPEN_EVENT,
      handleCartEvent,
    );

    return () => {
      window.removeEventListener(
        CART_OPEN_EVENT,
        handleCartEvent,
      );
    };
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 0.6,
          ease: "easeOut",
        }}
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

            {/* Cart */}
            <motion.button
              type="button"
              onClick={() => setIsCartOpen(true)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              animate={
                totalItems > 0
                  ? {
                      scale: [1, 1.08, 1],
                    }
                  : {
                      scale: 1,
                    }
              }
              transition={{
                duration: 0.35,
                ease: "easeOut",
              }}
              className="relative flex h-10 w-10 items-center justify-center rounded-full bg-pizzaro-dark text-white"
              aria-label="Open shopping cart"
            >
              <ShoppingBag
                size={18}
                strokeWidth={2}
              />

              {/* Cart count */}
              <motion.span
                key={totalItems}
                initial={{
                  scale: 0.4,
                  opacity: 0,
                }}
                animate={{
                  scale: [0.4, 1.25, 1],
                  opacity: 1,
                }}
                transition={{
                  duration: 0.35,
                  times: [0, 0.55, 1],
                  ease: "easeOut",
                }}
                className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-pizzaro-red px-1 text-[10px] font-bold text-white"
              >
                {totalItems}
              </motion.span>
            </motion.button>

            {/* Sign In */}
            <Button
              size="sm"
              className="hidden sm:inline-flex"
            >
              Sign In
            </Button>

            {/* Mobile menu */}
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-pizzaro-dark/10 md:hidden"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </>
  );
}

export default Navbar;