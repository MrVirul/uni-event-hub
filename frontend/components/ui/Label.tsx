import React from 'react';
import { Text, StyleSheet, TextProps } from 'react-native';

export function Label({ style, ...props }: TextProps) {
  return (
    <Text style={[styles.label, style]} {...props} />
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#09090b', // zinc-950
    marginBottom: 8,
    lineHeight: 14 * 1.4,
  },
});
