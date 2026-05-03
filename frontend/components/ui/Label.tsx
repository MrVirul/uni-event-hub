import React from "react";
import { Text, StyleSheet, TextProps } from "react-native";

export function Label({ style, ...props }: TextProps) {
  return <Text style={[styles.label, style]} {...props} />;
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155", // slate-700
    marginBottom: 6,
    letterSpacing: 0.1,
  },
});
