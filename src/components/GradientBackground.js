import React from 'react';
import WebCompatibleLinearGradient from './WebCompatibleLinearGradient';
import { View, StyleSheet } from 'react-native';
import { COLORS, SPACING } from '../utils/constants';
import { useTheme } from '../context/ThemeContext';

export default function GradientBackground({ children, variant = 'light', theme = 'default' }) {
  const { isDarkMode } = useTheme();
  const colors = getColors(isDarkMode);
  
  // Si es 'white', usar fondo según el tema
  if (variant === 'white') {
    return (
      <View style={[styles.container, { backgroundColor: COLORS.white }]}>
        <View style={styles.content}>
          {children}
        </View>
      </View>
    );
  }
  
  // Si hay un tema específico, usar sus colores
  if (theme !== 'default') {
    const themeColors = COLORS;
    return (
              <View style={[styles.container, { backgroundColor: COLORS.gray[50] }]}>
        <WebCompatibleLinearGradient
          colors={[COLORS.gray[50], COLORS.white]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <View style={styles.content}>
            {children}
          </View>
        </WebCompatibleLinearGradient>
      </View>
    );
  }
  
  // Gradiente normal
  const gradientColors = gradients[variant] || gradients.light;
  
  return (
    <WebCompatibleLinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.content}>
        {children}
      </View>
    </WebCompatibleLinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: SPACING.xl,
  },
});
