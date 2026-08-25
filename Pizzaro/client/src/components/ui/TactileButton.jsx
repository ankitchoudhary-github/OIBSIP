import { Link } from "react-router-dom";

const TactileButton = ({
  children,
  href,
  size = "md",
  depth = "shallow",
  className = "",
  onClick,
  type = "button",
}) => {
  const sizeClasses =
    size === "sm"
      ? "px-4 py-2 text-xs"
      : "px-5 py-2.5 text-sm";

  const depthClasses =
    depth === "shallow"
      ? "shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_2px_0_rgba(0,0,0,0.25)]"
      : "shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_3px_0_rgba(0,0,0,0.3)]";

  const classes = `
    inline-flex items-center justify-center gap-1.5
    rounded-full
    bg-[#4a4a4a]
    font-semibold
    text-white
    transition-all duration-150
    hover:bg-[#555]
    active:translate-y-[1px]
    active:shadow-none
    ${sizeClasses}
    ${depthClasses}
    ${className}
  `;

  if (href) {
    return (
      <Link to={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={classes}
    >
      {children}
    </button>
  );
};

export default TactileButton;