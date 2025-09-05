import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { COLORS, BORDER_RADIUS, SPACING, SHADOWS } from '../utils/constants';

export default function AppCard({ 
  children, 
  style, 
  elevationLevel = 'sm', 
  showGloss = true,
  onPress,
  variant = 'glass',
  padding = 'xl'
}) {
  const CardComponent = onPress ? TouchableOpacity : View;
  
  const getPadding = () => {
    switch (padding) {
      case 'xs': return spacing.xs;
      case 'sm': return spacing.sm;
      case 'md': return spacing.md;
      case 'lg': return spacing.lg;
      case 'xl': return spacing.xl;
      default: return spacing.xl;
    }
  };

  const getVariantStyle = () => {
    switch (variant) {
      case 'solid':
        return {
          backgroundColor: COLORS.white,
          borderWidth: 1,
          borderColor: COLORS.gray[200],
        };
      case 'glass':
      default:
        return {
          borderWidth: 1,
          borderColor: 'rgba(0,0,0,0.08)',
          backgroundColor: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(10px)',
        };
    }
  };

  return (
    <CardComponent
      style={{
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.lg,
        overflow: 'hidden',
        // Web-compatible shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
        ...getVariantStyle(),
        ...(style || {}),
      }}
      onPress={onPress}
    >
      {showGloss && variant === 'glass' ? (
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          backgroundColor: 'rgba(255,255,255,0.8)',
        }} />
      ) : null}
      <View style={{}}>{children}</View>
    </CardComponent>
  );
}
