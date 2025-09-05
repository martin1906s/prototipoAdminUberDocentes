import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';

// Importar AsyncStorage solo en plataformas nativas
let AsyncStorage;
if (Platform.OS !== 'web') {
  AsyncStorage = require('@react-native-async-storage/async-storage').default;
}

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe usarse dentro de ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Cargar tema guardado al inicializar
  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      if (Platform.OS === 'web') {
        // En web, usar localStorage directamente
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme !== null) {
          setIsDarkMode(savedTheme === 'dark');
        }
      } else if (AsyncStorage) {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme !== null) {
          setIsDarkMode(savedTheme === 'dark');
        }
      }
    } catch (error) {
      // Error al cargar el tema - usar tema por defecto
      console.warn('Error loading theme:', error);
    }
  };

  const toggleTheme = async () => {
    try {
      const newTheme = !isDarkMode;
      setIsDarkMode(newTheme);
      if (Platform.OS === 'web') {
        // En web, usar localStorage directamente
        localStorage.setItem('theme', newTheme ? 'dark' : 'light');
      } else if (AsyncStorage) {
        await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
      }
    } catch (error) {
      // Error al guardar el tema
      console.warn('Error saving theme:', error);
    }
  };

  const value = {
    isDarkMode,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
