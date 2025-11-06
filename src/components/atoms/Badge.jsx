import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ 
  className, 
  variant = "default",
  size = "md",
  children,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";
  
  const variants = {
    default: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    primary: "bg-primary/10 text-primary hover:bg-primary/20",
    secondary: "bg-secondary/10 text-secondary hover:bg-secondary/20", 
    accent: "bg-accent/10 text-accent hover:bg-accent/20",
    success: "bg-success/10 text-success hover:bg-success/20",
    warning: "bg-warning/10 text-warning hover:bg-warning/20",
    error: "bg-error/10 text-error hover:bg-error/20",
    outline: "border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50"
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs rounded-full",
    md: "px-2.5 py-1 text-xs rounded-full",
    lg: "px-3 py-1.5 text-sm rounded-lg"
  };

  return (
    <span
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;