import React from 'react';
import { TextInput, StyleSheet, TextInputProps, View } from 'react-native';

interface InputProps extends TextInputProps {
  error?: string;
}

export const Input = React.forwardRef<TextInput, InputProps>(
  ({ style, error, ...props }, ref) => {
    return (
      <View style={styles.container}>
        <TextInput
          ref={ref}
          style={[
            styles.input,
            error ? styles.inputError : null,
            style,
          ]}
          placeholderTextColor="#71717a" // zinc-500
          {...props}
        />
      </View>
    );
  }
);

Input.displayName = 'Input';

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  input: {
    height: 40,
    width: '100%',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e4e4e7', // zinc-200
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#09090b', // zinc-950
  },
  inputError: {
    borderColor: '#ef4444', // red-500
  },
});
