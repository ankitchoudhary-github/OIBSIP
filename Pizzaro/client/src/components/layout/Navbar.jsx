import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ShoppingBag,
  Menu,
  ChevronDown,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import Button from "../ui/Button";
import CartDrawer from "../cart/CartDrawer";
import { useCart } from "../../context/useCart";

export const CART_OPEN_EVENT = "pizzaro:open-cart";
export const AUTH_CHANGED_EVENT = "pizzaro:auth-changed";

function Navbar() {
  const navigate = useNavigate();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [user, setUser] = useState(null);

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

  useEffect(() => {
    function loadUser() {
      const storedUser = localStorage.getItem(
        "pizzaro_user",
      );

      if (!storedUser) {
        setUser(null);
        return;
      }

      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }

    loadUser();

    window.addEventListener(
      AUTH_CHANGED_EVENT,
      loadUser,
    );

    return () => {
      window.removeEventListener(
        AUTH_CHANGED_EVENT,
        loadUser,
      );
    };
  }, []);

  function handleLogout() {
    localStorage.removeItem("pizzaro_user_token");
    localStorage.removeItem("pizzaro_user");

    setUser(null);
    setIsAccountOpen(false);

    window.dispatchEvent(
      new Event(AUTH_CHANGED_EVENT),
    );

    navigate("/", { replace: true });
  }

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
          <button
            type="button"
            onClick={() => navigate("/")}
            className="font-display text-2xl font-bold tracking-tight text-pizzaro-dark"
          >
            Pizzaro
            <span className="text-pizzaro-red">.</span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            <button
              type="button"
              onClick={() => navigate("/menu")}
              className="text-sm font-medium text-pizzaro-muted transition-colors hover:text-pizzaro-red"
            >
              Menu
            </button>

            <a
              href="/#customize"
              className="text-sm font-medium text-pizzaro-muted transition-colors hover:text-pizzaro-red"
            >
              Customize
            </a>

            <a
              href="/#how-it-works"
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
              className="relative flex h-10 w-10 items-center justify-center rounded-full bg-pizzaro-dark text-white"
              aria-label="Open shopping cart"
            >
              <ShoppingBag
                size={18}
                strokeWidth={2}
              />

              <AnimatePresence mode="popLayout">
                <motion.span
                  key={totalItems}
                  initial={{
                    scale: 0.6,
                    opacity: 0,
                  }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                  }}
                  exit={{
                    scale: 0.6,
                    opacity: 0,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 22,
                  }}
                  className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-pizzaro-red px-1 text-[10px] font-bold text-white"
                >
                  {totalItems}
                </motion.span>
              </AnimatePresence>
            </motion.button>

            {/* Account */}
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() =>
                    setIsAccountOpen((current) => !current)
                  }
                  className="flex items-center gap-2 rounded-full border border-pizzaro-dark/10 bg-white px-3 py-2 transition hover:border-pizzaro-dark/20"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pizzaro-dark text-xs font-bold text-white">
                    {user.name
                      ?.charAt(0)
                      .toUpperCase() || "U"}
                  </div>

                  <span className="hidden max-w-28 truncate text-sm font-semibold text-pizzaro-dark sm:block">
                    {user.name}
                  </span>

                  <ChevronDown
                    size={15}
                    className={`text-pizzaro-muted transition-transform ${
                      isAccountOpen
                        ? "rotate-180"
                        : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isAccountOpen && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: -5,
                        scale: 0.98,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                      }}
                      exit={{
                        opacity: 0,
                        y: -5,
                        scale: 0.98,
                      }}
                      transition={{
                        duration: 0.15,
                      }}
                      className="absolute right-0 mt-3 w-56 overflow-hidden rounded-2xl border border-black/5 bg-white p-2 shadow-xl"
                    >
                      <div className="px-3 py-3">
                        <p className="text-sm font-semibold text-pizzaro-dark">
                          {user.name}
                        </p>

                        <p className="mt-1 truncate text-xs text-pizzaro-muted">
                          {user.email}
                        </p>
                      </div>

                      <div className="my-1 h-px bg-black/5" />

                      <button
                        type="button"
                        onClick={() => {
                          setIsAccountOpen(false);
                          navigate("/dashboard");
                        }}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-pizzaro-dark transition hover:bg-pizzaro-cream"
                      >
                        <User size={17} />
                        My Dashboard
                      </button>

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-pizzaro-dark transition hover:bg-red-50 hover:text-pizzaro-red"
                      >
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Button
                size="sm"
                className="hidden sm:inline-flex"
                onClick={() => navigate("/login")}
              >
                Sign In
              </Button>
            )}

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

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </>
  );
}

export default Navbar;