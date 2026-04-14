import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

export default function Button({ children, variant = "primary", size = "md", className = "", ...props }: ButtonProps) {
  const base = "inline-flex items-center justify-center font-semibold rounded-2xl transition-all active:scale-95";
  const variants = {
    primary: "bg-green-700 text-white hover:bg-green-800 shadow-md",
    secondary: "bg-amber-400 text-gray-900 hover:bg-amber-500 shadow-md",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100 border border-gray-300",
  };
  const sizes = { sm: "px-4 py-2 text-sm", md: "px-6 py-3 text-base", lg: "px-8 py-4 text-lg" };

  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
}
