import React from "react";
import { TextInput, StyleSheet, TextInputProps, View } from "react-native";

interface InputProps extends TextInputProps {
  error?: string;
}

export const Input = React.forwardRef<TextInput, InputProps>(
  ({ style, error, ...props }, ref) => {
    return (
      <View style={styles.container}>
        <TextInput
          ref={ref}
          style={[styles.input, error ? styles.inputError : null, style]}
          placeholderTextColor="#71717a" // zinc-500
          {...props}
        />
      </View>
    );
  },
);

Input.displayName = "Input";

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  input: {
    height: 48,
    width: "100%",
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#e2e8f0", // slate-200
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: "#0f172a", // slate-900
  },
  inputError: {
    borderColor: "#e11d48", // rose-600
  },
});
