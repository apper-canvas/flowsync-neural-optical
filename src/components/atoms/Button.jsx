import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md", 
  children,
  disabled,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary/90 focus:ring-primary/50 shadow-sm",
    secondary: "bg-secondary text-white hover:bg-secondary/90 focus:ring-secondary/50 shadow-sm",
    accent: "bg-accent text-white hover:bg-accent/90 focus:ring-accent/50 shadow-sm",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-primary/50",
    ghost: "text-gray-700 hover:bg-gray-100 focus:ring-primary/50",
    success: "bg-success text-white hover:bg-success/90 focus:ring-success/50 shadow-sm",
    warning: "bg-warning text-white hover:bg-warning/90 focus:ring-warning/50 shadow-sm",
    error: "bg-error text-white hover:bg-error/90 focus:ring-error/50 shadow-sm"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-lg",
    md: "px-4 py-2 text-sm rounded-lg", 
    lg: "px-6 py-3 text-base rounded-xl"
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        disabled && "hover:bg-current",
        className
      )}
      ref={ref}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;