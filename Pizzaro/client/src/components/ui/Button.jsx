import { motion } from "motion/react";

const variants = {
  primary:
    "bg-pizzaro-red text-white shadow-pizzaro hover:bg-pizzaro-red-dark",
  secondary:
    "bg-pizzaro-dark text-white shadow-pizzaro hover:bg-pizzaro-brown",
  outline:
    "border border-pizzaro-dark/15 bg-white text-pizzaro-dark hover:bg-pizzaro-dark hover:text-white",
  ghost:
    "bg-transparent text-pizzaro-dark hover:bg-pizzaro-dark/5",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm",
  lg: "px-7 py-3.5 text-base",
};

function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  type = "button",
  onClick,
}) {
  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      whileHover={disabled ? undefined : { y: -2 }}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      transition={{ duration: 0.15 }}
      className={`
        inline-flex
        items-center
        justify-center
        gap-2
        rounded-full
        font-semibold
        transition-colors
        duration-200
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {children}
    </motion.button>
  );
}

export default Button;