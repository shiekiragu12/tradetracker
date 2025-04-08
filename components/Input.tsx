import React from 'react';
import { 
  TextInput, 
  View, 
  Text, 
  StyleSheet, 
  TextInputProps,
  ViewStyle,
  TextStyle
} from 'react-native';
import Colors from '@/app/constants/colors';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  inputStyle?: ViewStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export default function Input({
  label,
  error,
  containerStyle,
  labelStyle,
  inputStyle,
  leftIcon,
  rightIcon,
  ...rest
}: InputProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      <View style={[
        styles.inputContainer,
        error ? styles.inputError : {},
        inputStyle
      ]}>
        {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
        <TextInput
          style={[
            styles.input,
            leftIcon ? { paddingLeft: 8 } : {},
            rightIcon ? { paddingRight: 8 } : {},
          ]}
          placeholderTextColor="#9ca3af"
          {...rest}
        />
        {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
    color: Colors.text.light,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: Colors.text.light,
  },
  inputError: {
    borderColor: Colors.error,
  },
  errorText: {
    color: Colors.error,
    fontSize: 12,
    marginTop: 4,
  },
  iconLeft: {
    paddingLeft: 16,
  },
  iconRight: {
    paddingRight: 16,
  },
});