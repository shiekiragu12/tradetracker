import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps
} from 'react-native';
import Colors from '../app/constants/colors';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  disabled = false,
  style,
  textStyle,
  leftIcon,
  rightIcon,
  ...rest
}: ButtonProps) {
  const getBackgroundColor = () => {
    if (disabled) return '#ccc';
    
    switch (variant) {
      case 'primary':
        return Colors.primary.light;
      case 'secondary':
        return Colors.secondary.light;
      case 'outline':
      case 'ghost':
        return 'transparent';
      default:
        return Colors.primary.light;
    }
  };

  const getBorderColor = () => {
    if (disabled) return '#ccc';
    
    switch (variant) {
      case 'outline':
        return Colors.primary.light;
      default:
        return 'transparent';
    }
  };

  const getTextColor = () => {
    if (disabled) return '#666';
    
    switch (variant) {
      case 'primary':
      case 'secondary':
        return '#fff';
      case 'outline':
        return Colors.primary.light;
      case 'ghost':
        return Colors.text.light;
      default:
        return '#fff';
    }
  };

  const getSizeStyle = (): ViewStyle => {
    switch (size) {
      case 'small':
        return { paddingVertical: 6, paddingHorizontal: 12 };
      case 'large':
        return { paddingVertical: 16, paddingHorizontal: 24 };
      default:
        return { paddingVertical: 12, paddingHorizontal: 16 };
    }
  };

  const getTextSize = (): TextStyle => {
    switch (size) {
      case 'small':
        return { fontSize: 14 };
      case 'large':
        return { fontSize: 18 };
      default:
        return { fontSize: 16 };
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isLoading || disabled}
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: variant === 'outline' ? 1 : 0,
        },
        getSizeStyle(),
        style,
      ]}
      activeOpacity={0.8}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <>
          {leftIcon}
          <Text
            style={[
              styles.text,
              { color: getTextColor() },
              getTextSize(),
              leftIcon || rightIcon ? { marginHorizontal: 8 } : {},
              textStyle,
            ]}
          >
            {title}
          </Text>
          {rightIcon}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
});