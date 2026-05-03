import React from "react";
import { View, Text, StyleSheet, ViewProps } from "react-native";

export function Card({ style, ...props }: ViewProps) {
  return <View style={[styles.card, style]} {...props} />;
}

export function CardHeader({ style, ...props }: ViewProps) {
  return <View style={[styles.header, style]} {...props} />;
}

export function CardTitle({
  style,
  ...props
}: React.ComponentProps<typeof Text>) {
  return <Text style={[styles.title, style]} {...props} />;
}

export function CardDescription({
  style,
  ...props
}: React.ComponentProps<typeof Text>) {
  return <Text style={[styles.description, style]} {...props} />;
}

export function CardContent({ style, ...props }: ViewProps) {
  return <View style={[styles.content, style]} {...props} />;
}

export function CardFooter({ style, ...props }: ViewProps) {
  return <View style={[styles.footer, style]} {...props} />;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f1f5f9", // slate-100
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },
  header: {
    padding: 24,
    paddingBottom: 16,
    flexDirection: "column",
    gap: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0f172a", // slate-900
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 15,
    color: "#64748b", // slate-500
    lineHeight: 22,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  footer: {
    padding: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
});
