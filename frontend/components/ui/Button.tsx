import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableOpacityProps,
  ActivityIndicator,
  Platform,
} from "react-native";

interface ButtonProps extends TouchableOpacityProps {
  children: React.ReactNode;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  loading?: boolean;
  textStyle?: any;
}

export function Button({
  children,
  variant = "default",
  size = "default",
  loading = false,
  style,
  textStyle,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.base,
        (styles as any)[`${variant}Variant`],
        (styles as any)[`${size}Size`],
        (disabled || loading) && styles.disabled,
        style,
      ]}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={
            variant === "default" || variant === "destructive"
              ? "#fafafa"
              : "#09090b"
          }
        />
      ) : (
        <Text
          style={[
            styles.textBase,
            (styles as any)[`${variant}Text`],
            (styles as any)[`${size}TextSize`],
            textStyle,
          ]}
        >
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  disabled: {
    opacity: 0.5,
  },
  // Variants
  defaultVariant: {
    backgroundColor: '#0f172a', // slate-900
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  destructiveVariant: {
    backgroundColor: '#e11d48', // rose-600
    shadowColor: '#e11d48',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  outlineVariant: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#e2e8f0', // slate-200
  },
  secondaryVariant: {
    backgroundColor: '#f1f5f9', // slate-100
  },
  ghostVariant: {
    backgroundColor: 'transparent',
  },
  linkVariant: {
    backgroundColor: 'transparent',
  },
  // Sizes
  defaultSize: {
    height: 44,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  smSize: {
    height: 36,
    paddingHorizontal: 12,
  },
  lgSize: {
    height: 52,
    paddingHorizontal: 32,
  },
  iconSize: {
    height: 44,
    width: 44,
  },
  // Text Styles
  textBase: {
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  defaultText: {
    color: '#f8fafc', // slate-50
  },
  destructiveText: {
    color: '#ffffff',
  },
  outlineText: {
    color: '#1e293b', // slate-800
  },
  secondaryText: {
    color: '#1e293b',
  },
  ghostText: {
    color: '#475569', // slate-600
  },
  linkText: {
    color: '#0f172a',
    textDecorationLine: 'underline',
  },
  // Text Sizes
  defaultTextSize: {
    fontSize: 15,
  },
  smTextSize: {
    fontSize: 13,
  },
  lgTextSize: {
    fontSize: 17,
  },
});
