import React from 'react';
import { Platform, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';
import { StoreProvider } from './src/store/store';
import { AuthProvider } from './src/context/AuthContext';

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
    <SafeAreaProvider>
      <AuthProvider>
        <StoreProvider>
          <StatusBar barStyle="light-content" backgroundColor="#6366f1" />
          <RootNavigator />
        </StoreProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}