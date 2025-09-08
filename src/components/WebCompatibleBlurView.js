import React from 'react';
import { View, Platform } from 'react-native';
import { BlurView } from 'expo-blur';

export default function WebCompatibleBlurView({ children, intensity = 20, tint = 'light', style, ...props }) {
  // En web, usar un View con fondo semitransparente en lugar de BlurView
  if (Platform.OS === 'web') {
    return (
      <View 
        style={[
          {
            backgroundColor: tint === 'light' 
              ? 'rgba(255, 255, 255, 0.8)' 
              : 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
          },
          style
        ]}
        {...props}
      >
        {children}
      </View>
    );
  }

  // En móvil, usar BlurView nativo
  return (
    <BlurView intensity={intensity} tint={tint} style={style} {...props}>
      {children}
    </BlurView>
  );
}
