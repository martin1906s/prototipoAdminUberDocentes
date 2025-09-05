import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { COLORS, FONT_SIZES, FONT_WEIGHTS, SPACING, CONTAINER_SPACING, BORDER_RADIUS, SHADOWS } from '../utils/constants';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);

    if (result.success) {
      // La navegación se maneja automáticamente por el AuthContext
    } else {
      Alert.alert('Error', result.error);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    const result = await loginWithGoogle();
    setIsLoading(false);

    if (result.success) {
      // La navegación se maneja automáticamente por el AuthContext
    } else {
      Alert.alert('Error', result.error);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={COLORS.gradientPrimary}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <KeyboardAvoidingView 
          style={styles.keyboardContainer} 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            {/* Header con logo y título */}
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <LinearGradient
                  colors={[COLORS.white, COLORS.gray[100]]}
                  style={styles.logoCircle}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name="school" size={32} color={COLORS.primary} />
                </LinearGradient>
              </View>
              <Text style={styles.title}>Admin Docentes</Text>
              <Text style={styles.subtitle}>Sistema de Gestión Educativa</Text>
              <View style={styles.subtitleAccent} />
            </View>

            {/* Formulario de login */}
            <View style={styles.formContainer}>
              <Text style={styles.formTitle}>Iniciar Sesión</Text>
              <Text style={styles.formSubtitle}>Accede a tu cuenta para continuar</Text>
              
              <View style={styles.inputContainer}>
                <View style={styles.inputLabelContainer}>
                  <Ionicons name="mail-outline" size={16} color={COLORS.primary} />
                  <Text style={styles.label}>Correo electrónico</Text>
                </View>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="tu@email.com"
                    placeholderTextColor={COLORS.gray[400]}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <View style={styles.inputLabelContainer}>
                  <Ionicons name="lock-closed-outline" size={16} color={COLORS.primary} />
                  <Text style={styles.label}>Contraseña</Text>
                </View>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="Tu contraseña"
                    placeholderTextColor={COLORS.gray[400]}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />
                </View>
              </View>

              <TouchableOpacity 
                style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                onPress={handleLogin}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={isLoading ? [COLORS.gray[400], COLORS.gray[500]] : COLORS.gradientSecondary}
                  style={styles.loginButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  {isLoading ? (
                    <ActivityIndicator color={COLORS.white} size="small" />
                  ) : (
                    <Ionicons name="log-in-outline" size={20} color={COLORS.white} />
                  )}
                  <Text style={styles.loginButtonText}>
                    {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* Separador */}
              <View style={styles.separator}>
                <View style={styles.separatorLine} />
                <Text style={styles.separatorText}>o</Text>
                <View style={styles.separatorLine} />
              </View>

              {/* Botón de Google */}
              <TouchableOpacity 
                style={[styles.googleButton, isLoading && styles.googleButtonDisabled]}
                onPress={handleGoogleLogin}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={isLoading ? [COLORS.gray[400], COLORS.gray[500]] : [COLORS.white, COLORS.gray[50]]}
                  style={styles.googleButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name="logo-google" size={20} color={COLORS.danger} />
                  <Text style={styles.googleButtonText}>
                    {isLoading ? 'Simulando...' : 'Simular Google Login'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.demoContainer}>
                <View style={styles.demoHeader}>
                  <Ionicons name="information-circle-outline" size={16} color={COLORS.accent} />
                  <Text style={styles.demoTitle}>Opciones de acceso</Text>
                </View>
                <View style={styles.demoContent}>
                  <View style={styles.demoItem}>
                    <Ionicons name="shield-checkmark-outline" size={14} color={COLORS.success} />
                    <Text style={styles.demoText}>Login tradicional: admin@admindocentes.com / admin123</Text>
                  </View>
                  <View style={styles.demoItem}>
                    <Ionicons name="logo-google" size={14} color={COLORS.danger} />
                    <Text style={styles.demoText}>Google Login: Simulación automática</Text>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: CONTAINER_SPACING.screen,
    paddingTop: SPACING['6xl'],
    paddingBottom: SPACING['4xl'],
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING['5xl'],
  },
  logoContainer: {
    marginBottom: SPACING['2xl'],
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.xl,
  },
  title: {
    fontSize: FONT_SIZES['4xl'],
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.white,
    marginBottom: SPACING.sm,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.white,
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: SPACING.md,
  },
  subtitleAccent: {
    width: 60,
    height: 4,
    backgroundColor: COLORS.accent,
    borderRadius: 2,
    marginTop: SPACING.sm,
  },
  formContainer: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS['3xl'],
    padding: CONTAINER_SPACING.card,
    ...SHADOWS.xl,
    marginHorizontal: SPACING.sm,
  },
  formTitle: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.gray[800],
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  formSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[500],
    textAlign: 'center',
    marginBottom: SPACING['3xl'],
  },
  inputContainer: {
    marginBottom: SPACING['2xl'],
  },
  inputLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.gray[700],
    marginLeft: SPACING.sm,
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    borderWidth: 2,
    borderColor: COLORS.gray[200],
    borderRadius: BORDER_RADIUS.xl,
    padding: CONTAINER_SPACING.input,
    fontSize: FONT_SIZES.base,
    backgroundColor: COLORS.white,
    color: COLORS.gray[800],
    ...SHADOWS.sm,
  },
  loginButton: {
    borderRadius: BORDER_RADIUS.xl,
    marginTop: SPACING.md,
    marginBottom: SPACING['2xl'],
    overflow: 'hidden',
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: CONTAINER_SPACING.button,
    gap: SPACING.sm,
  },
  loginButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING['2xl'],
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.gray[300],
  },
  separatorText: {
    marginHorizontal: SPACING.lg,
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[500],
    fontWeight: FONT_WEIGHTS.medium,
  },
  googleButton: {
    borderRadius: BORDER_RADIUS.xl,
    marginBottom: SPACING['2xl'],
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: COLORS.gray[200],
  },
  googleButtonDisabled: {
    opacity: 0.6,
  },
  googleButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: CONTAINER_SPACING.button,
    gap: SPACING.sm,
  },
  googleButtonText: {
    color: COLORS.gray[800],
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  demoContainer: {
    backgroundColor: COLORS.gray[50],
    borderRadius: BORDER_RADIUS.lg,
    padding: CONTAINER_SPACING.card,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.accent,
  },
  demoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  demoTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.gray[800],
  },
  demoContent: {
    gap: SPACING.sm,
  },
  demoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  demoText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray[600],
    flex: 1,
  },
});

export default LoginScreen;
