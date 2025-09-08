import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, radii, spacing, overlay, typography, elevation } from '../theme/theme';

export default function AppInput({ 
  leftIcon, 
  rightIcon,
  label,
  error,
  variant = 'modern',
  size = 'md',
  style, 
  ...props 
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [isSecure, setIsSecure] = useState(props.secureTextEntry);
  const [focusedScale] = useState(new Animated.Value(1));

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          paddingVertical: 12,
          paddingHorizontal: 16,
          fontSize: 14,
          minHeight: 44,
        };
      case 'lg':
        return {
          paddingVertical: 18,
          paddingHorizontal: 20,
          fontSize: 18,
          minHeight: 56,
        };
      default:
        return {
          paddingVertical: 16,
          paddingHorizontal: 18,
          fontSize: 16,
          minHeight: 52,
        };
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'solid':
        return {
          backgroundColor: colors.white,
          borderColor: isFocused ? colors.primary : colors.neutral200,
          borderWidth: 2,
        };
      case 'glass':
        return {
          backgroundColor: overlay.surfaceDark,
          borderColor: isFocused ? overlay.glassHighlight : overlay.glassBorder,
          borderWidth: 1,
          ...elevation.xs,
        };
      case 'modern':
      default:
        return {
          backgroundColor: colors.white,
          borderColor: isFocused ? colors.primary : colors.neutral200,
          borderWidth: 1.5,
          ...elevation.sm,
        };
    }
  };

  const getTextColor = () => {
    return variant === 'glass' ? overlay.textOnDarkPrimary : colors.neutral900;
  };

  const getPlaceholderColor = () => {
    return variant === 'glass' ? overlay.textOnDarkSecondary : colors.neutral500;
  };

  const handleFocus = () => {
    setIsFocused(true);
    Animated.spring(focusedScale, {
      toValue: 1.02,
      useNativeDriver: true,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.spring(focusedScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handleToggleSecure = () => {
    setIsSecure(!isSecure);
  };

  return (
    <View style={style}>
      {label && (
        <Text style={{
          ...typography.label,
          color: variant === 'glass' ? overlay.textOnDarkPrimary : colors.neutral700,
          marginBottom: 8,
          fontWeight: '600',
        }}>
          {label}
        </Text>
      )}
      
      <Animated.View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderRadius: 12,
          ...getSizeStyles(),
          ...getVariantStyles(),
          transform: [{ scale: focusedScale }],
        }}
      >
        {leftIcon && (
          <MaterialIcons 
            name={leftIcon} 
            size={20} 
            color={isFocused ? colors.primary : (variant === 'glass' ? overlay.textOnDarkPrimary : colors.neutral500)} 
            style={{ marginRight: spacing.sm }} 
          />
        )}
        
        <TextInput
          placeholderTextColor={getPlaceholderColor()}
          style={{
            flex: 1,
            color: getTextColor(),
            fontSize: getSizeStyles().fontSize,
            ...typography.body,
            textAlignVertical: props.multiline ? 'top' : 'center',
            minHeight: props.multiline ? 80 : undefined,
          }}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={isSecure}
          {...props}
        />
        
        {props.secureTextEntry && (
          <TouchableOpacity onPress={handleToggleSecure} style={{ marginLeft: spacing.sm }}>
            <MaterialIcons 
              name={isSecure ? 'visibility' : 'visibility-off'} 
              size={20} 
              color={variant === 'glass' ? overlay.textOnDarkPrimary : colors.neutral500} 
            />
          </TouchableOpacity>
        )}
        
        {rightIcon && !props.secureTextEntry && (
          <MaterialIcons 
            name={rightIcon} 
            size={20} 
            color={variant === 'glass' ? overlay.textOnDarkPrimary : colors.neutral500} 
            style={{ marginLeft: spacing.sm }} 
          />
        )}
      </Animated.View>
      
      {error && (
        <Text style={{
          ...typography.caption,
          color: colors.danger,
          marginTop: 6,
          marginLeft: 4,
          fontWeight: '500',
        }}>
          {error}
        </Text>
      )}
    </View>
  );
}