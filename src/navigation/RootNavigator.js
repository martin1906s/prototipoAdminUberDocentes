import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../store/store';
import { COLORS, FONT_SIZES, FONT_WEIGHTS, SPACING, BORDER_RADIUS, SHADOWS } from '../utils/constants';

// LoginScreen eliminado
import RoleSelectScreen from '../screens/RoleSelectScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import ReportsScreen from '../screens/ReportsScreen';

// Nuevas pantallas de administración
import TeacherManagementScreen from '../screens/TeacherManagementScreen';
import ProposalManagementScreen from '../screens/ProposalManagementScreen';
import UserManagementScreen from '../screens/UserManagementScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';
import SettingsScreen from '../screens/SettingsScreen';

// Pantallas del docente
import TeacherProfileScreen from '../screens/TeacherProfileScreen';
import TeacherProposalsScreen from '../screens/TeacherProposalsScreen';
import TeacherScheduleScreen from '../screens/TeacherScheduleScreen';
import TeacherSetupScreen from '../screens/TeacherSetupScreen';

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

// Navegación del docente
function TeacherTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#8B5CF6',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: { 
          backgroundColor: '#FFFFFF', 
          position: 'absolute', 
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 8,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case 'TeacherProposals': iconName = 'mail'; break;
            case 'TeacherProfile': iconName = 'person'; break;
            case 'TeacherSchedule': iconName = 'schedule'; break;
            default: iconName = 'help';
          }
          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="TeacherProposals" component={TeacherProposalsScreen} options={{ title: 'Propuestas' }} />
      <Tab.Screen name="TeacherProfile" component={TeacherProfileScreen} options={{ title: 'Perfil' }} />
      <Tab.Screen name="TeacherSchedule" component={TeacherScheduleScreen} options={{ title: 'Horario' }} />
    </Tab.Navigator>
  );
}

// Navegación principal de la app
function AppNavigator() {
  const { isLoading } = useAuth();
  const { state } = useStore();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="RoleSelect" component={RoleSelectScreen} />
        <Stack.Screen name="Admin" component={AdminTabNavigator} />
        <Stack.Screen name="TeacherTabs" component={TeacherTabNavigator} />
        <Stack.Screen name="TeacherSetup" component={TeacherSetupScreen} />

        {/* Pantallas de administración */}
        <Stack.Screen name="TeacherManagement" component={TeacherManagementScreen} />
        <Stack.Screen name="ProposalManagement" component={ProposalManagementScreen} />
        <Stack.Screen name="UserManagement" component={UserManagementScreen} />
        <Stack.Screen name="Analytics" component={AnalyticsScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.gray[50],
  },
  loadingText: {
    marginTop: SPACING.lg,
    fontSize: FONT_SIZES.base,
    color: COLORS.gray[600],
    fontWeight: FONT_WEIGHTS.medium,
  },
});

export default AppNavigator;
