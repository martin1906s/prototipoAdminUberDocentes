import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AnimatedScale from './AnimatedScale';
import { colors, radii, spacing, typography, elevation } from '../theme/theme';

export default function AppButton({ 
  title, 
  onPress, 
  variant = 'primary', 
  size = 'md', 
  style,
  icon,
  leftIcon,
  loading = false,
  disabled = false,
  iconOnly = false
}) {
  const backgroundByVariant = {
    primary: colors.primary,
    secondary: colors.secondary,
    success: colors.success,
    danger: colors.danger,
    warning: colors.warning,
    info: colors.info,
    ghost: 'rgba(255,255,255,0.15)',
    outline: 'transparent',
  };

  const textColorByVariant = {
    primary: colors.white,
    secondary: colors.white,
    success: colors.white,
    danger: colors.white,
    warning: colors.white,
    info: colors.white,
    ghost: colors.white,
    outline: colors.primary,
  };

  const borderColorByVariant = {
    primary: 'transparent',
    secondary: 'transparent',
    success: 'transparent',
    danger: 'transparent',
    warning: 'transparent',
    info: 'transparent',
    ghost: 'rgba(255,255,255,0.3)',
    outline: colors.primary,
  };

  const paddingYBySize = { 
    xs: spacing.xs, 
    sm: spacing.sm, 
    md: spacing.md, 
    lg: spacing.lg,
    xl: spacing.xl 
  };
  const paddingXBySize = { 
    xs: spacing.sm, 
    sm: spacing.md, 
    md: spacing.lg, 
    lg: spacing.xl,
    xl: spacing.xxl 
  };

  // Para botones solo con icono
  const iconOnlyPadding = {
    xs: spacing.sm,
    sm: spacing.md,
    md: spacing.lg,
    lg: spacing.xl,
    xl: spacing.xxl
  };
  const fontSizeBySize = { 
    xs: 12, 
    sm: 14, 
    md: 16, 
    lg: 18,
    xl: 20 
  };

  const bg = backgroundByVariant[variant] || colors.primary;
  const color = textColorByVariant[variant] || colors.white;
  const borderColor = borderColorByVariant[variant] || 'transparent';

  const buttonStyle = {
    backgroundColor: disabled ? colors.neutral300 : bg,
    borderWidth: variant === 'ghost' || variant === 'outline' ? 1 : 0,
    borderColor: disabled ? colors.neutral400 : borderColor,
    paddingVertical: iconOnly ? iconOnlyPadding[size] || spacing.lg : paddingYBySize[size] || spacing.md,
    paddingHorizontal: iconOnly ? iconOnlyPadding[size] || spacing.lg : paddingXBySize[size] || spacing.lg,
    borderRadius: iconOnly ? radii.lg : radii.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: disabled ? 0.6 : 1,
    minWidth: iconOnly ? 48 : undefined,
    minHeight: iconOnly ? 48 : undefined,
    // Web-compatible shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  };

  const textStyle = {
    ...typography.button,
    color: disabled ? colors.neutral500 : color,
    fontSize: fontSizeBySize[size] || 16,
    textAlign: 'center',
    marginLeft: icon ? spacing.sm : 0,
    marginLeft: leftIcon ? spacing.sm : (icon ? spacing.sm : 0),
  };

  const handlePress = () => {
    console.log('AppButton pressed:', { title, leftIcon, disabled }); // Debug log
    if (!disabled && onPress) {
      onPress();
    }
  };

  return (
    <AnimatedScale
      onPress={disabled ? undefined : handlePress}
      style={[buttonStyle, style]}
    >
      {leftIcon && (
        <MaterialIcons 
          name={leftIcon} 
          size={fontSizeBySize[size] || 16} 
          color={disabled ? colors.neutral500 : color}
          style={{ marginRight: iconOnly ? 0 : spacing.xs }}
        />
      )}
      {icon && (
        <View style={{ marginRight: iconOnly ? 0 : spacing.xs }}>
          {icon}
        </View>
      )}
      {title && !iconOnly && (
        <Text style={textStyle}>
          {loading ? 'Cargando...' : title}
        </Text>
      )}
    </AnimatedScale>
  );
}