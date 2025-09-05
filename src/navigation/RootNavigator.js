import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { COLORS, FONT_SIZES, FONT_WEIGHTS, SPACING, BORDER_RADIUS, SHADOWS } from '../utils/constants';

import LoginScreen from '../screens/LoginScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import ReportsScreen from '../screens/ReportsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Navegación de administrador
function AdminTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray[400],
        tabBarStyle: { 
          backgroundColor: COLORS.white, 
          position: 'absolute', 
          borderTopWidth: 1,
          borderTopColor: COLORS.gray[200],
          borderTopLeftRadius: BORDER_RADIUS['2xl'],
          borderTopRightRadius: BORDER_RADIUS['2xl'],
          paddingBottom: SPACING.md,
          paddingTop: SPACING.md,
          height: 70,
          ...SHADOWS.lg,
        },
        tabBarLabelStyle: {
          fontSize: FONT_SIZES.xs,
          fontWeight: FONT_WEIGHTS.semibold,
          marginTop: SPACING.xs,
        },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;
          switch (route.name) {
            case 'AdminDashboard': 
              iconName = focused ? 'analytics' : 'analytics-outline'; 
              break;
            case 'Reports': 
              iconName = focused ? 'bar-chart' : 'bar-chart-outline'; 
              break;
            default: 
              iconName = 'help-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen 
        name="AdminDashboard" 
        component={AdminDashboardScreen} 
        options={{ title: 'Dashboard' }} 
      />
      <Tab.Screen 
        name="Reports" 
        component={ReportsScreen} 
        options={{ title: 'Reportes' }} 
      />
    </Tab.Navigator>
  );
}

// Navegación principal de la app
function AppNavigator() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null; // Aquí podrías mostrar un spinner de carga
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="Admin" component={AdminTabNavigator} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
