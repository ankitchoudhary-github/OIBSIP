import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import {
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
  ChevronRight,
} from "lucide-react";

import { useCart } from "../../context/useCart";

const CartDrawer = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    subtotal,
  } = useCart();

  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const handleCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-90 bg-black/30 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "spring",
              stiffness: 320,
              damping: 32,
            }}
            className="fixed right-0 top-0 z-100 flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-black/5 px-6 py-5">
              <div>
                <div className="flex items-center gap-2">
                  <ShoppingBag
                    size={20}
                    className="text-pizzaro-red"
                  />

                  <h2 className="font-display text-2xl font-bold text-pizzaro-dark">
                    Your Cart
                  </h2>
                </div>

                <motion.p
                  key={totalItems}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-sm text-pizzaro-muted"
                >
                  {totalItems === 0
                    ? "Nothing here yet"
                    : `${totalItems} item${
                        totalItems === 1 ? "" : "s"
                      }`}
                </motion.p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-black/5 text-pizzaro-dark transition hover:bg-black/10"
                aria-label="Close cart"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cart contents */}
            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
              {cartItems.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex h-20 w-20 items-center justify-center rounded-full bg-pizzaro-cream"
                  >
                    <ShoppingBag
                      size={32}
                      className="text-pizzaro-red"
                    />
                  </motion.div>

                  <h3 className="mt-6 font-display text-2xl font-bold text-pizzaro-dark">
                    Your cart is empty
                  </h3>

                  <p className="mt-2 max-w-xs text-sm leading-6 text-pizzaro-muted">
                    Add something delicious from the menu or
                    build your own pizza.
                  </p>

                  <button
                    type="button"
                    onClick={onClose}
                    className="mt-6 rounded-full bg-pizzaro-red px-6 py-3 text-sm font-semibold text-white transition hover:bg-pizzaro-red-dark"
                  >
                    Start Ordering
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence initial={false}>
                    {cartItems.map((item) => (
                      <motion.article
                        key={item.id}
                        layout
                        initial={{
                          opacity: 0,
                          y: 15,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        exit={{
                          opacity: 0,
                          x: 50,
                          scale: 0.96,
                        }}
                        transition={{
                          duration: 0.22,
                        }}
                        className="rounded-3xl border border-black/5 bg-pizzaro-cream p-4"
                      >
                        {/* Main item row */}
                        <div className="flex gap-4">
                          {/* Image */}
                          <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#f5e8dc]">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-full w-full object-contain p-1"
                            />
                          </div>

                          {/* Main content */}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <span className="text-[10px] font-bold uppercase tracking-[1.5px] text-pizzaro-red">
                                  {item.type === "custom"
                                    ? "Custom Pizza"
                                    : "Menu Pizza"}
                                </span>

                                <h3 className="mt-1 font-display text-lg font-bold text-pizzaro-dark">
                                  {item.name}
                                </h3>
                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  removeFromCart(item.id)
                                }
                                className="shrink-0 text-pizzaro-muted transition hover:text-red-500"
                                aria-label={`Remove ${item.name}`}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>

                            {/* Custom details */}
                            {item.type === "custom" && (
                              <div className="mt-3 space-y-1 text-xs leading-5 text-pizzaro-muted">
                                <p>
                                  <span className="font-semibold text-pizzaro-dark">
                                    Base:
                                  </span>{" "}
                                  {item.base}
                                </p>

                                <p>
                                  <span className="font-semibold text-pizzaro-dark">
                                    Sauce:
                                  </span>{" "}
                                  {item.sauce}
                                </p>

                                <p>
                                  <span className="font-semibold text-pizzaro-dark">
                                    Cheese:
                                  </span>{" "}
                                  {item.cheese}
                                </p>

                                {item.vegetables?.length > 0 && (
                                  <p>
                                    <span className="font-semibold text-pizzaro-dark">
                                      Toppings:
                                    </span>{" "}
                                    {item.vegetables.join(" · ")}
                                  </p>
                                )}
                              </div>
                            )}

                            {/* Menu description */}
                            {item.type === "menu" &&
                              item.description && (
                                <p className="mt-2 text-xs leading-5 text-pizzaro-muted">
                                  {item.description}
                                </p>
                              )}
                          </div>
                        </div>

                        {/* Bottom controls */}
                        <div className="mt-4 flex items-center justify-between border-t border-black/5 pt-4">
                          <div className="flex items-center rounded-full border border-black/10 bg-white">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  item.quantity - 1,
                                )
                              }
                              className="flex h-9 w-9 items-center justify-center text-pizzaro-dark transition hover:text-pizzaro-red"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={14} />
                            </button>

                            <motion.span
                              key={item.quantity}
                              initial={{
                                opacity: 0,
                                y: -4,
                              }}
                              animate={{
                                opacity: 1,
                                y: 0,
                              }}
                              className="w-8 text-center text-sm font-semibold text-pizzaro-dark"
                            >
                              {item.quantity}
                            </motion.span>

                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  item.quantity + 1,
                                )
                              }
                              className="flex h-9 w-9 items-center justify-center text-pizzaro-dark transition hover:text-pizzaro-red"
                              aria-label="Increase quantity"
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          <motion.span
                            key={`${item.id}-${item.quantity}`}
                            initial={{
                              opacity: 0,
                              scale: 0.95,
                            }}
                            animate={{
                              opacity: 1,
                              scale: 1,
                            }}
                            className="font-display text-xl font-bold text-pizzaro-dark"
                          >
                            ₹{item.price * item.quantity}
                          </motion.span>
                        </div>
                      </motion.article>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Sticky footer */}
            {cartItems.length > 0 && (
              <div className="border-t border-black/5 bg-white px-6 py-5">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-pizzaro-muted">
                      Subtotal
                    </span>

                    <span className="font-semibold text-pizzaro-dark">
                      ₹{subtotal}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-pizzaro-muted">
                      Delivery
                    </span>

                    <span className="font-semibold text-pizzaro-green">
                      Free
                    </span>
                  </div>

                  <div className="my-3 border-t border-black/5" />

                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-sm text-pizzaro-muted">
                        Total
                      </p>

                      <motion.p
                        key={subtotal}
                        initial={{
                          opacity: 0,
                          y: 4,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        className="font-display text-3xl font-bold text-pizzaro-dark"
                      >
                        ₹{subtotal}
                      </motion.p>
                    </div>

                    <button
                      type="button"
                      onClick={handleCheckout}
                      className="flex items-center gap-2 rounded-full bg-pizzaro-red px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-pizzaro-red/20 transition hover:bg-pizzaro-red-dark"
                    >
                      Checkout
                      <ChevronRight size={17} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;