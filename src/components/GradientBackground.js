import React from 'react';
import WebCompatibleLinearGradient from './WebCompatibleLinearGradient';
import { View, StyleSheet } from 'react-native';
import { getColors, spacing, gradients } from '../theme/theme';
import { useTheme } from '../context/ThemeContext';

export default function GradientBackground({ children, variant = 'light', theme = 'default' }) {
  const { isDarkMode } = useTheme();
  const colors = getColors(isDarkMode);
  
  // Si es 'white', usar fondo según el tema
  if (variant === 'white') {
    return (
      <View style={[styles.container, { backgroundColor: colors.white }]}>
        <View style={styles.content}>
          {children}
        </View>
      </View>
    );
  }
  
  // Si hay un tema específico, usar sus colores
  if (theme !== 'default' && colors.themes[theme]) {
    const themeColors = colors.themes[theme];
    return (
      <View style={[styles.container, { backgroundColor: themeColors.background }]}>
        <WebCompatibleLinearGradient
          colors={[themeColors.background, themeColors.card]}
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
    padding: spacing.xl,
  },
});
