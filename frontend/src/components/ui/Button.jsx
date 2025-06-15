const Button = ({
  children,
  onClick,
  variant = "primary",
  size = "medium",
  className = "",
  disabled = false,
  fullWidth = false,
  type = "button",
}) => {
  const variants = {
    primary: "bg-[#E9967A] text-white hover:bg-[#e07a5f]",
    secondary: "bg-[#FFD54F] text-[#8b5e34] hover:bg-[#FFCA28]",
    danger: "bg-[#E57373] text-white hover:bg-[#e53935]",
    success: "bg-green-600 text-white hover:bg-green-700",
    ghost:
      "bg-[#FFF8E1] text-[#8b5e34] border border-[#FFE082] hover:bg-[#FFECB3]",
  };

  const sizes = {
    small: "px-4 py-1.5 text-sm",
    medium: "px-5 py-2.5 text-base",
    large: "px-8 py-4 text-lg",
    xl: "px-10 py-5 text-xl",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
          ${variants[variant]} 
          ${sizes[size]} 
          ${fullWidth ? "w-full" : ""} 
          font-medium rounded-lg shadow-sm transition-colors
          flex items-center justify-center gap-2
          disabled:opacity-50 disabled:pointer-events-none
          ${className}
        `}
    >
      {children}
    </button>
  );
};

export default Button;
