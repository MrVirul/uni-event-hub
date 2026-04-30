import * as React from "react";
import { TextInput, View, type TextInputProps, Platform } from "react-native";
import { cn } from "../../lib/utils";

export interface InputProps extends TextInputProps {
  containerClassName?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<TextInput, InputProps>(
  ({ className, containerClassName, leftIcon, rightIcon, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);

    return (
      <View
        className={cn(
          "flex-row items-center bg-white h-14 px-4 rounded-2xl border-2",
          isFocused ? "border-accent ring-2 ring-accent/20" : "border-primary/5",
          containerClassName
        )}
      >
        {leftIcon && <View className="mr-3 opacity-50">{leftIcon}</View>}
        <TextInput
          ref={ref}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          className={cn(
            "flex-1 text-primary font-bold text-base h-full",
            Platform.OS === "web" && "outline-none",
            className
          )}
          placeholderTextColor="#94A3B8"
          {...props}
        />
        {rightIcon && <View className="ml-3">{rightIcon}</View>}
      </View>
    );
  }
);

Input.displayName = "Input";

export { Input };
