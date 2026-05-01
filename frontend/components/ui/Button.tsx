import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, ActivityIndicator } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  children: React.ReactNode;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  loading?: boolean;
}

export function Button({ 
  children, 
  variant = 'default', 
  size = 'default', 
  loading = false,
  style, 
  disabled,
  ...props 
}: ButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.base,
        styles[`${variant}Variant`],
        styles[`${size}Size`],
        (disabled || loading) && styles.disabled,
        style,
      ]}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'default' || variant === 'destructive' ? '#fafafa' : '#09090b'} />
      ) : (
        <Text style={[
          styles.textBase,
          styles[`${variant}Text`],
          styles[`${size}Text`]
        ]}>
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
    borderRadius: 6,
  },
  disabled: {
    opacity: 0.5,
  },
  // Variants
  defaultVariant: {
    backgroundColor: '#09090b', // zinc-950
  },
  destructiveVariant: {
    backgroundColor: '#ef4444', // red-500
  },
  outlineVariant: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#e4e4e7', // zinc-200
  },
  secondaryVariant: {
    backgroundColor: '#f4f4f5', // zinc-100
  },
  ghostVariant: {
    backgroundColor: 'transparent',
  },
  linkVariant: {
    backgroundColor: 'transparent',
  },
  // Sizes
  defaultSize: {
    height: 40,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  smSize: {
    height: 36,
    paddingHorizontal: 12,
  },
  lgSize: {
    height: 44,
    paddingHorizontal: 32,
  },
  iconSize: {
    height: 40,
    width: 40,
  },
  // Text Styles
  textBase: {
    fontWeight: '500',
  },
  defaultText: {
    color: '#fafafa', // zinc-50
  },
  destructiveText: {
    color: '#fafafa',
  },
  outlineText: {
    color: '#09090b', // zinc-950
  },
  secondaryText: {
    color: '#09090b',
  },
  ghostText: {
    color: '#09090b',
  },
  linkText: {
    color: '#09090b',
    textDecorationLine: 'underline',
  },
  // Text Sizes
  defaultTextSize: {
    fontSize: 14,
  },
  smTextSize: {
    fontSize: 12,
  },
  lgTextSize: {
    fontSize: 16,
  },
});
