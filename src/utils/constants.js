// Colores del tema - Esquema vibrante y profesional
export const COLORS = {
  // Colores primarios vibrantes
  primary: '#6366f1', // Indigo vibrante
  primaryDark: '#4f46e5',
  primaryLight: '#818cf8',
  
  // Colores secundarios modernos
  secondary: '#ec4899', // Rosa vibrante
  secondaryDark: '#db2777',
  secondaryLight: '#f472b6',
  
  // Colores de acento vibrantes
  accent: '#06b6d4', // Cian vibrante
  accentDark: '#0891b2',
  accentLight: '#22d3ee',
  
  // Colores de estado vibrantes
  danger: '#ef4444', // Rojo vibrante
  dangerDark: '#dc2626',
  dangerLight: '#f87171',
  warning: '#f59e0b', // Ámbar vibrante
  warningDark: '#d97706',
  warningLight: '#fbbf24',
  success: '#10b981', // Verde esmeralda
  successDark: '#059669',
  successLight: '#34d399',
  info: '#3b82f6', // Azul vibrante
  infoDark: '#2563eb',
  infoLight: '#60a5fa',
  
  // Gradientes vibrantes
  gradientPrimary: ['#6366f1', '#8b5cf6', '#ec4899'],
  gradientSecondary: ['#06b6d4', '#3b82f6', '#6366f1'],
  gradientAccent: ['#f59e0b', '#f97316', '#ef4444'],
  gradientSuccess: ['#10b981', '#34d399', '#06b6d4'],
  gray: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
  white: '#ffffff',
  black: '#000000',
};

// Tamaños de fuente
export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 32,
  '5xl': 36,
};

// Pesos de fuente
export const FONT_WEIGHTS = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
};

// Espaciado - Sistema de 8px base para mejor consistencia
export const SPACING = {
  xs: 4,      // 4px - Espaciado mínimo
  sm: 8,      // 8px - Espaciado pequeño
  md: 12,     // 12px - Espaciado medio
  lg: 16,     // 16px - Espaciado grande
  xl: 20,     // 20px - Espaciado extra grande
  '2xl': 24,  // 24px - Espaciado doble
  '3xl': 32,  // 32px - Espaciado triple
  '4xl': 40,  // 40px - Espaciado cuádruple
  '5xl': 48,  // 48px - Espaciado quíntuple
  '6xl': 56,  // 56px - Espaciado sextuple
  '7xl': 64,  // 64px - Espaciado séptuple
  '8xl': 72,  // 72px - Espaciado octuple
  '9xl': 80,  // 80px - Espaciado nonuple
  '10xl': 88, // 88px - Espaciado décuple
};

// Espaciado específico para contenedores
export const CONTAINER_SPACING = {
  screen: 24,        // Padding general de pantalla
  card: 20,          // Padding interno de tarjetas
  section: 32,       // Espaciado entre secciones
  header: 24,        // Padding del header
  content: 20,       // Padding del contenido principal
  modal: 24,         // Padding de modales
  form: 20,          // Padding de formularios
  list: 16,          // Padding de listas
  button: 16,        // Padding de botones
  input: 16,         // Padding de inputs
};

// Radios de borde
export const BORDER_RADIUS = {
  none: 0,
  sm: 4,
  md: 6,
  lg: 8,
  xl: 12,
  '2xl': 16,
  '3xl': 20,
  full: 9999,
};

// Sombras
export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

// Roles de usuario
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  DOCTOR: 'doctor',
  TECHNICIAN: 'technician',
};

// Configuración de la aplicación
export const APP_CONFIG = {
  name: 'Admin Docentes',
  version: '1.0.0',
  description: 'Aplicación para gestión de docentes y propuestas',
  supportEmail: 'soporte@admindocentes.com',
  supportPhone: '02-2345678',
  website: 'www.admindocentes.com',
};

// Mensajes de error comunes
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Error de conexión. Verifica tu internet.',
  INVALID_CREDENTIALS: 'Credenciales inválidas.',
  USER_NOT_FOUND: 'Usuario no encontrado.',
  UNAUTHORIZED: 'No autorizado.',
  FORBIDDEN: 'Acceso denegado.',
  SERVER_ERROR: 'Error del servidor. Intenta más tarde.',
  UNKNOWN_ERROR: 'Error desconocido.',
};

// Mensajes de éxito comunes
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Inicio de sesión exitoso.',
  LOGOUT_SUCCESS: 'Sesión cerrada exitosamente.',
  GOOGLE_LOGIN_SUCCESS: 'Inicio de sesión con Google exitoso.',
};

// Validaciones
export const VALIDATION_RULES = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[0-9]{10}$/,
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
};

export default {
  COLORS,
  FONT_SIZES,
  FONT_WEIGHTS,
  SPACING,
  CONTAINER_SPACING,
  BORDER_RADIUS,
  SHADOWS,
  USER_ROLES,
  APP_CONFIG,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  VALIDATION_RULES,
};
