import * as React from "react";
import { cn } from "../../../lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "destructive" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "md",
      children,
      ...props
    },
    ref
  ) => {
    const base =
      "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 shadow-sm";

    const variants: Record<string, string> = {
      default:
        "bg-primary text-white hover:bg-primary-700 focus-visible:ring-primary-400",
      /* secondary: lighter tone of the landing palette used for secondary actions */
      secondary:
        "bg-primary-200 text-primary-900 hover:bg-primary-300 focus-visible:ring-primary-200",
      outline:
        "border border-gray-300 text-gray-800 hover:bg-gray-100 focus-visible:ring-gray-300",
      destructive:
        "bg-destructive text-white hover:bg-destructive focus-visible:ring-destructive",
      ghost:
        "bg-transparent text-gray-700 hover:bg-gray-100 focus-visible:ring-gray-300",
    };

    const sizes: Record<string, string> = {
      sm: "px-3 py-1 text-sm rounded-md",
      md: "px-4 py-2 text-sm rounded-md",
      lg: "px-6 py-3 text-base rounded-md",
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
