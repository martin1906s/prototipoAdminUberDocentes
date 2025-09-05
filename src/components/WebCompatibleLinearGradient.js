import React from 'react';
import { Platform, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function WebCompatibleLinearGradient({ children, ...props }) {
  if (Platform.OS === 'web') {
    // En web, usar un View con estilos CSS para simular el gradiente
    const { colors, start, end, style, ...otherProps } = props;
    
    // Convertir gradiente a CSS
    const gradientStyle = {
      background: `linear-gradient(${
        start && end 
          ? `${Math.atan2(end.y - start.y, end.x - start.x) * 180 / Math.PI + 90}deg`
          : '135deg'
      }, ${colors.join(', ')})`,
      ...style,
    };

    return (
      <View style={gradientStyle} {...otherProps}>
        {children}
      </View>
    );
  }

  // En móvil, usar LinearGradient nativo
  return (
    <LinearGradient {...props}>
      {children}
    </LinearGradient>
  );
}
