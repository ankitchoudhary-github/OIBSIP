import { AnimatePresence, motion } from "motion/react";
import {
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";
import { useCart } from "../../context/CartContext";

const CartDrawer = ({ isOpen, onClose }) => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    subtotal,
  } = useCart();

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
              stiffness: 300,
              damping: 30,
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

                <p className="mt-1 text-sm text-pizzaro-muted">
                  {cartItems.length === 0
                    ? "Nothing here yet"
                    : `${cartItems.length} item${
                        cartItems.length === 1 ? "" : "s"
                      }`}
                </p>
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

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {cartItems.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-pizzaro-cream">
                    <ShoppingBag
                      size={32}
                      className="text-pizzaro-red"
                    />
                  </div>

                  <h3 className="mt-6 font-display text-2xl font-bold text-pizzaro-dark">
                    Your cart is empty
                  </h3>

                  <p className="mt-2 max-w-xs text-sm leading-6 text-pizzaro-muted">
                    Add a pizza from the menu or create your own
                    masterpiece.
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
                          x: 40,
                        }}
                        transition={{
                          duration: 0.2,
                        }}
                        className="rounded-3xl border border-black/5 bg-pizzaro-cream p-4"
                      >
                        <div className="flex gap-4">
                          {/* Image */}
                          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#f5e8dc]">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-full w-full object-contain p-1"
                            />
                          </div>

                          {/* Details */}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <h3 className="truncate font-semibold text-pizzaro-dark">
                                  {item.name}
                                </h3>

                                {item.type === "custom" && (
                                  <p className="mt-1 text-xs leading-5 text-pizzaro-muted">
                                    {item.base} · {item.sauce} ·{" "}
                                    {item.cheese}
                                  </p>
                                )}
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

                            {item.type === "custom" &&
                              item.vegetables?.length > 0 && (
                                <p className="mt-1 text-xs text-pizzaro-muted">
                                  {item.vegetables.join(" · ")}
                                </p>
                              )}

                            <div className="mt-4 flex items-center justify-between">
                              {/* Quantity */}
                              <div className="flex items-center rounded-full border border-black/10 bg-white">
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateQuantity(
                                      item.id,
                                      item.quantity - 1
                                    )
                                  }
                                  className="flex h-8 w-8 items-center justify-center text-pizzaro-dark transition hover:text-pizzaro-red"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus size={14} />
                                </button>

                                <motion.span
                                  key={item.quantity}
                                  initial={{ y: -5, opacity: 0 }}
                                  animate={{ y: 0, opacity: 1 }}
                                  className="w-7 text-center text-sm font-semibold text-pizzaro-dark"
                                >
                                  {item.quantity}
                                </motion.span>

                                <button
                                  type="button"
                                  onClick={() =>
                                    updateQuantity(
                                      item.id,
                                      item.quantity + 1
                                    )
                                  }
                                  className="flex h-8 w-8 items-center justify-center text-pizzaro-dark transition hover:text-pizzaro-red"
                                  aria-label="Increase quantity"
                                >
                                  <Plus size={14} />
                                </button>
                              </div>

                              {/* Price */}
                              <span className="font-display text-lg font-bold text-pizzaro-dark">
                                ₹{item.price * item.quantity}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.article>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
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

                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-sm text-pizzaro-muted">
                        Total
                      </p>

                      <p className="font-display text-2xl font-bold text-pizzaro-dark">
                        ₹{subtotal}
                      </p>
                    </div>

                    <button
                      type="button"
                      className="rounded-full bg-pizzaro-red px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-pizzaro-red/20 transition hover:bg-pizzaro-red-dark"
                    >
                      Proceed to Checkout
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