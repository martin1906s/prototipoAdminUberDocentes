import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Animated, Platform } from 'react-native';
import GradientBackground from '../components/GradientBackground';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../store/store';
import { colors, typography, radii, elevation } from '../theme/theme';
import { SPACING } from '../utils/constants';
import WebCompatibleLinearGradient from '../components/WebCompatibleLinearGradient';

const { width } = Dimensions.get('window');

export default function RoleSelectScreen({ navigation }) {
  const { state, actions } = useStore();
  const [selectedRole, setSelectedRole] = useState(null);
  const [scaleAnimations] = useState({
    admin: new Animated.Value(1),
    teacher: new Animated.Value(1),
  });

  const handleSelect = (role) => {
    // Animación de selección
    setSelectedRole(role);
    Animated.sequence([
      Animated.timing(scaleAnimations[role], {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.timing(scaleAnimations[role], {
        toValue: 1,
        duration: 100,
        useNativeDriver: Platform.OS !== 'web',
      }),
    ]).start();

    // Navegación con delay para mostrar la animación
    setTimeout(() => {
      actions.setRole(role);
      if (role === 'admin') {
        navigation.replace('Admin');
      } else if (role === 'teacher') {
        // Si no hay datos del docente, redirigir al registro
        if (!state.teacherProfile) {
          navigation.replace('TeacherSetup');
        } else {
          navigation.replace('TeacherTabs');
        }
      }
    }, 200);
  };

  const RoleCard = ({ role, title, icon, color, gradient, onPress, description }) => (
    <Animated.View style={[
      styles.roleCardContainer,
      { transform: [{ scale: scaleAnimations[role] }] }
    ]}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        <WebCompatibleLinearGradient
          colors={gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.roleCard,
            selectedRole === role && styles.roleCardSelected
          ]}
        >
          <View style={styles.roleCardContent}>
            <View style={styles.iconContainer}>
              <Ionicons name={icon} size={32} color="white" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.roleTitle}>{title}</Text>
              <Text style={styles.roleDescription}>{description}</Text>
            </View>
            <View style={styles.arrowContainer}>
              <Ionicons name="arrow-forward" size={20} color="white" />
            </View>
          </View>
        </WebCompatibleLinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <GradientBackground variant="white" theme="roleSelect">
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logoBackground}>
              <Ionicons name="school" size={40} color={colors.themes.roleSelect.primary} />
            </View>
            <View style={styles.logoAccent}>
              <Ionicons name="sparkles" size={18} color="white" />
            </View>
          </View>
          <Text style={styles.appTitle}>Admin Docentes</Text>
          <Text style={styles.appSubtitle}>
            Sistema de gestión para administradores y docentes
          </Text>
          <View style={styles.headerDivider} />
        </View>

        <View style={styles.rolesContainer}>
          <Text style={styles.sectionTitle}>Selecciona tu rol</Text>
          
          <RoleCard
            role="admin"
            title="Admin"
            icon="shield-checkmark"
            color={colors.themes.roleSelect.primary}
            gradient={['#0891B2', '#06B6D4']}
            onPress={() => handleSelect('admin')}
          />
          
          <RoleCard
            role="teacher"
            title="Docente"
            icon="person"
            color={colors.themes.roleSelect.secondary}
            gradient={['#7C3AED', '#8B5CF6']}
            onPress={() => handleSelect('teacher')}
          />
        </View>
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: SPACING.xl,
    paddingTop: SPACING['3xl'],
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  logoContainer: {
    position: 'relative',
    marginBottom: SPACING.lg,
  },
  logoBackground: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    ...elevation.md,
  },
  logoAccent: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: colors.themes.roleSelect.accent,
    borderRadius: 14,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    ...elevation.sm,
  },
  appTitle: {
    ...typography.title,
    color: colors.themes.roleSelect.primary,
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: SPACING.xs,
    letterSpacing: -0.5,
  },
  appSubtitle: {
    ...typography.body,
    color: colors.themes.roleSelect.textSecondary,
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 22,
    maxWidth: width * 0.85,
    marginBottom: SPACING.md,
  },
  headerDivider: {
    width: 60,
    height: 4,
    backgroundColor: colors.themes.roleSelect.primary,
    borderRadius: 2,
    opacity: 0.3,
  },
  rolesContainer: {
    marginBottom: SPACING['3xl'],
  },
  sectionTitle: {
    ...typography.title,
    color: colors.themes.roleSelect.text,
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  roleCardContainer: {
    marginBottom: SPACING.lg,
    borderRadius: radii.lg,
    overflow: 'hidden',
    ...elevation.md,
  },
  roleCard: {
    padding: SPACING.xl,
    minHeight: 100,
    position: 'relative',
  },
  roleCardSelected: {
    transform: [{ scale: 1.02 }],
  },
  roleCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.lg,
  },
  textContainer: {
    flex: 1,
    marginRight: SPACING.md,
  },
  roleTitle: {
    ...typography.subtitle,
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  roleDescription: {
    ...typography.bodySmall,
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    lineHeight: 20,
  },
  arrowContainer: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
