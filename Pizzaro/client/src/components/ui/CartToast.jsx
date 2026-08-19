import { AnimatePresence, motion } from "motion/react";
import {
  Check,
  ShoppingBag,
  X,
  ArrowRight,
} from "lucide-react";

const CartToast = ({
  item,
  onClose,
  onViewCart,
}) => {
  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{
            opacity: 0,
            y: -20,
            scale: 0.96,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            y: -20,
            scale: 0.96,
          }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 28,
          }}
          className="fixed right-6 top-24 z-200 w-[calc(100%-3rem)] max-w-sm"
        >
          <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-2xl">
            {/* Main content */}
            <div className="p-4">
              <div className="flex items-center gap-3">
                {/* Success icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    delay: 0.08,
                    type: "spring",
                    stiffness: 500,
                    damping: 20,
                  }}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pizzaro-green/10 text-pizzaro-green"
                >
                  <Check
                    size={20}
                    strokeWidth={2.5}
                  />
                </motion.div>

                {/* Item image */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#f5e8dc]">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-contain p-1"
                  />
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <ShoppingBag
                      size={13}
                      className="text-pizzaro-muted"
                    />

                    <span className="text-xs font-semibold text-pizzaro-muted">
                      Added to cart
                    </span>
                  </div>

                  <p className="mt-0.5 truncate font-semibold text-pizzaro-dark">
                    {item.name}
                  </p>

                  <p className="mt-0.5 text-xs text-pizzaro-muted">
                    ₹{item.price}
                  </p>
                </div>

                {/* Close */}
                <button
                  type="button"
                  onClick={onClose}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-pizzaro-muted transition hover:bg-black/5 hover:text-pizzaro-dark"
                  aria-label="Dismiss notification"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* View cart action */}
            <div className="border-t border-black/5 bg-pizzaro-cream px-4 py-3">
              <button
                type="button"
                onClick={onViewCart}
                className="group flex w-full items-center justify-between text-sm font-semibold text-pizzaro-dark"
              >
                <span className="transition group-hover:text-pizzaro-red">
                  View Cart
                </span>

                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-pizzaro-dark shadow-sm transition group-hover:bg-pizzaro-red group-hover:text-white">
                  <ArrowRight size={15} />
                </span>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CartToast;