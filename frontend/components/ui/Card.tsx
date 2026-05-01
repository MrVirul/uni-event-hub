import React from 'react';
import { View, Text, StyleSheet, ViewProps } from 'react-native';

export function Card({ style, ...props }: ViewProps) {
  return <View style={[styles.card, style]} {...props} />;
}

export function CardHeader({ style, ...props }: ViewProps) {
  return <View style={[styles.header, style]} {...props} />;
}

export function CardTitle({ style, ...props }: React.ComponentProps<typeof Text>) {
  return <Text style={[styles.title, style]} {...props} />;
}

export function CardDescription({ style, ...props }: React.ComponentProps<typeof Text>) {
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
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e4e4e7', // zinc-200
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    padding: 24,
    paddingBottom: 16,
    flexDirection: 'column',
    gap: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#09090b',
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 14,
    color: '#71717a', // zinc-500
  },
  content: {
    padding: 24,
    paddingTop: 0,
  },
  footer: {
    padding: 24,
    paddingTop: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
