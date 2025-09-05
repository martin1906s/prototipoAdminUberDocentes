import React from 'react';
import { Platform } from 'react-native';
import RootNavigator from './src/navigation/RootNavigator';
import { StoreProvider } from './src/store/store';
import { ThemeProvider } from './src/context/ThemeContext';

// Solo habilitar screens en plataformas nativas
if (Platform.OS !== 'web') {
  try {
    const { enableScreens } = require('react-native-screens');
    enableScreens();
  } catch (error) {
    console.warn('Error enabling screens:', error);
  }
}

export default function App() {
  return (
    <ThemeProvider>
      <StoreProvider>
        <RootNavigator />
      </StoreProvider>
    </ThemeProvider>
  );
}