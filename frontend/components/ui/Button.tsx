import * as React from "react";
import {
  Text,
  TouchableOpacity,
  ActivityIndicator,
  type TouchableOpacityProps,
} from "react-native";
import { cn } from "../../lib/utils";

interface ButtonProps extends TouchableOpacityProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "accent";
  size?: "default" | "sm" | "lg" | "icon";
  loading?: boolean;
  label?: string;
  labelClassName?: string;
}

const Button = React.forwardRef<TouchableOpacity, ButtonProps>(
  ({ className, variant = "default", size = "default", loading, label, labelClassName, children, ...props }, ref) => {
    const variants = {
      default: "bg-primary shadow-sm active:opacity-90",
      destructive: "bg-destructive shadow-sm active:opacity-90",
      outline: "border border-input bg-background shadow-sm active:bg-accent/10",
      secondary: "bg-secondary shadow-sm active:opacity-80",
      ghost: "active:bg-accent/10",
      link: "bg-transparent",
      accent: "bg-accent shadow-sm active:opacity-90",
    };

    const sizes = {
      default: "h-12 px-6 py-2 rounded-2xl",
      sm: "h-9 px-3 rounded-xl",
      lg: "h-14 px-8 rounded-[20px]",
      icon: "h-10 w-10 rounded-xl",
    };

    const labelVariants = {
      default: "text-primary-foreground",
      destructive: "text-destructive-foreground",
      outline: "text-primary",
      secondary: "text-secondary-foreground",
      ghost: "text-primary",
      link: "text-primary underline",
      accent: "text-primary",
    };

    const labelSizes = {
      default: "text-base font-bold",
      sm: "text-sm font-medium",
      lg: "text-lg font-black",
      icon: "text-base",
    };

    return (
      <TouchableOpacity
        ref={ref}
        disabled={loading || props.disabled}
        className={cn(
          "flex-row items-center justify-center transition-all",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {loading ? (
          <ActivityIndicator color={variant === "outline" || variant === "ghost" ? "#1D264F" : "white"} />
        ) : (
          <>
            {label ? (
              <Text className={cn(labelVariants[variant], labelSizes[size], labelClassName)}>
                {label}
              </Text>
            ) : null}
            {children}
          </>
        )}
      </TouchableOpacity>
    );
  }
);

Button.displayName = "Button";

export { Button };
