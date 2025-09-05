// Función para obtener colores según el tema
export const getColors = (isDark = false) => ({
  // Colores principales con mejor contraste y accesibilidad
  primary: isDark ? '#6366F1' : '#4F46E5', // Índigo más claro en modo oscuro
  primaryLight: isDark ? '#818CF8' : '#6366F1', // Índigo original para elementos secundarios
  primaryDark: isDark ? '#4F46E5' : '#3730A3', // Índigo oscuro para hover/active
  
  secondary: isDark ? '#8B5CF6' : '#7C3AED', // Púrpura más claro en modo oscuro
  secondaryLight: isDark ? '#A78BFA' : '#8B5CF6', // Púrpura original
  secondaryDark: isDark ? '#7C3AED' : '#5B21B6', // Púrpura oscuro
  
  accent: isDark ? '#EC4899' : '#DB2777', // Rosa más claro en modo oscuro
  accentLight: isDark ? '#F472B6' : '#EC4899', // Rosa original
  accentDark: isDark ? '#DB2777' : '#BE185D', // Rosa oscuro
  
  success: isDark ? '#10B981' : '#059669', // Verde más claro en modo oscuro
  successLight: isDark ? '#34D399' : '#10B981', // Verde original
  successDark: isDark ? '#059669' : '#047857', // Verde oscuro
  
  danger: isDark ? '#EF4444' : '#DC2626', // Rojo más claro en modo oscuro
  dangerLight: isDark ? '#F87171' : '#EF4444', // Rojo original
  dangerDark: isDark ? '#DC2626' : '#B91C1C', // Rojo oscuro
  
  warning: isDark ? '#F59E0B' : '#D97706', // Naranja más claro en modo oscuro
  warningLight: isDark ? '#FBBF24' : '#F59E0B', // Naranja original
  warningDark: isDark ? '#D97706' : '#B45309', // Naranja oscuro
  
  info: isDark ? '#06B6D4' : '#0891B2', // Cian más claro en modo oscuro
  infoLight: isDark ? '#22D3EE' : '#06B6D4', // Cian original
  infoDark: isDark ? '#0891B2' : '#0E7490', // Cian oscuro
  
  // Gradientes de fondo mejorados
  gradientStart: '#4F46E5',
  gradientEnd: '#7C3AED',
  
  // Colores neutros optimizados para mejor legibilidad
  neutral900: isDark ? '#F8FAFC' : '#0F172A', // Gris muy oscuro - mejor contraste
  neutral800: isDark ? '#F1F5F9' : '#1E293B', // Gris oscuro
  neutral700: isDark ? '#E2E8F0' : '#334155', // Gris medio oscuro
  neutral600: isDark ? '#CBD5E1' : '#475569', // Gris medio
  neutral500: isDark ? '#94A3B8' : '#64748B', // Gris
  neutral400: isDark ? '#64748B' : '#94A3B8', // Gris claro
  neutral300: isDark ? '#475569' : '#CBD5E1', // Gris muy claro
  neutral200: isDark ? '#334155' : '#E2E8F0', // Gris pálido
  neutral100: isDark ? '#1E293B' : '#F1F5F9', // Gris casi blanco
  neutral50: isDark ? '#0F172A' : '#F8FAFC', // Gris blanquecino
  white: isDark ? '#0F172A' : '#FFFFFF',
  black: isDark ? '#FFFFFF' : '#000000',
  
  // Colores especiales para la app
  glass: isDark ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)',
  glassBorder: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
  cardBg: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
  overlay: isDark ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)',
  
  // Temáticas por pantalla con mejor contraste
  themes: {
    roleSelect: {
      primary: isDark ? '#6366F1' : '#4F46E5', // Índigo con mejor contraste
      secondary: isDark ? '#8B5CF6' : '#7C3AED', // Púrpura con mejor contraste
      accent: isDark ? '#EC4899' : '#DB2777', // Rosa con mejor contraste
      background: isDark ? '#0F172A' : '#FFFFFF',
      card: isDark ? '#1E293B' : '#F8FAFC',
      text: isDark ? '#F8FAFC' : '#0F172A', // Texto más oscuro para mejor legibilidad
      textSecondary: isDark ? '#CBD5E1' : '#475569', // Texto secundario más legible
      textTertiary: isDark ? '#94A3B8' : '#64748B', // Texto terciario
    },
    userSearch: {
      primary: isDark ? '#06B6D4' : '#0891B2', // Cian con mejor contraste
      secondary: isDark ? '#0891B2' : '#0E7490', // Cian oscuro
      accent: isDark ? '#22D3EE' : '#06B6D4', // Cian claro
      background: isDark ? '#0F172A' : '#FFFFFF',
      card: isDark ? '#1E293B' : '#F0FDFA',
      text: isDark ? '#F8FAFC' : '#0F172A', // Texto principal más legible
      textSecondary: isDark ? '#CBD5E1' : '#475569',
      textTertiary: isDark ? '#94A3B8' : '#64748B',
    },
    userProfile: {
      primary: isDark ? '#3B82F6' : '#2563EB', // Azul moderno
      secondary: isDark ? '#1D4ED8' : '#1E40AF', // Azul oscuro
      accent: isDark ? '#60A5FA' : '#3B82F6', // Azul claro
      background: isDark ? '#0F172A' : '#FFFFFF',
      card: isDark ? '#1E293B' : '#F8FAFC',
      text: isDark ? '#F8FAFC' : '#0F172A',
      textSecondary: isDark ? '#CBD5E1' : '#475569',
      textTertiary: isDark ? '#94A3B8' : '#64748B',
    },
    teacherSetup: {
      primary: isDark ? '#FF6B6B' : '#FF4757', // Rojo coral vibrante
      secondary: isDark ? '#4ECDC4' : '#2ED573', // Verde turquesa brillante
      accent: isDark ? '#FFA726' : '#FF9800', // Naranja dorado
      background: isDark ? '#1A1A2E' : '#F8F9FA', // Fondo elegante
      card: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.9)', // Glassmorphism
      text: isDark ? '#FFFFFF' : '#2C3E50', // Texto principal
      textSecondary: isDark ? '#BDC3C7' : '#7F8C8D', // Texto secundario
      textTertiary: isDark ? '#95A5A6' : '#95A5A6', // Texto terciario
      surface: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)', // Superficie glass
      border: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)', // Bordes glass
      glow: isDark ? 'rgba(255,107,107,0.3)' : 'rgba(255,71,87,0.2)', // Efecto glow
    },
    teacherProposals: {
      primary: isDark ? '#F59E0B' : '#D97706', // Naranja con mejor contraste
      secondary: isDark ? '#D97706' : '#B45309', // Naranja oscuro
      accent: isDark ? '#FBBF24' : '#F59E0B', // Naranja claro
      background: isDark ? '#0F172A' : '#FFFFFF',
      card: isDark ? '#1E293B' : '#FFFBEB',
      text: isDark ? '#F8FAFC' : '#0F172A',
      textSecondary: isDark ? '#CBD5E1' : '#475569',
      textTertiary: isDark ? '#94A3B8' : '#64748B',
    },
    adminDashboard: {
      primary: isDark ? '#EF4444' : '#DC2626', // Rojo con mejor contraste
      secondary: isDark ? '#DC2626' : '#B91C1C', // Rojo oscuro
      accent: isDark ? '#F87171' : '#EF4444', // Rojo claro
      background: isDark ? '#0F172A' : '#FFFFFF',
      card: isDark ? '#1E293B' : '#FEF2F2',
      text: isDark ? '#F8FAFC' : '#0F172A',
      textSecondary: isDark ? '#CBD5E1' : '#475569',
      textTertiary: isDark ? '#94A3B8' : '#64748B',
    },
  }
});

// Exportar colores por defecto (modo claro)
export const colors = getColors(false);

export const overlay = {
  glassBg: 'rgba(255,255,255,0.8)',
  glassBorder: 'rgba(0,0,0,0.05)',
  glassHighlight: 'rgba(255,255,255,0.9)',
  surfaceDark: 'rgba(255,255,255,0.9)',
  surfaceDarkStrong: 'rgba(255,255,255,0.95)',
  textOnDarkPrimary: '#1F2937',
  textOnDarkSecondary: '#6B7280',
  textOnDarkTertiary: '#9CA3AF',
};

export const spacing = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 10,
  xl: 24,
  xxl: 32,
  // Espaciado adicional para mejor UX
  xxxl: 40,
  section: 48,
  page: 64,
};

export const radii = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  pill: 999,
};

export const typography = {
  display: { fontSize: 32, fontWeight: '800', letterSpacing: -0.2, lineHeight: 40 },
  title: { fontSize: 24, fontWeight: '800', letterSpacing: -0.2, lineHeight: 32 },
  subtitle: { fontSize: 18, fontWeight: '600', lineHeight: 24 },
  body: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
  bodySmall: { fontSize: 14, fontWeight: '400', lineHeight: 20 },
  button: { fontSize: 16, fontWeight: '700', lineHeight: 24 },
  caption: { fontSize: 12, fontWeight: '400', lineHeight: 16 },
  overline: { fontSize: 10, fontWeight: '600', lineHeight: 16, textTransform: 'uppercase', letterSpacing: 1 },
  // Nuevas variantes mejoradas
  heading: { fontSize: 20, fontWeight: '700', lineHeight: 28, letterSpacing: -0.1 },
  label: { fontSize: 14, fontWeight: '600', lineHeight: 20 },
  helper: { fontSize: 12, fontWeight: '400', lineHeight: 16, opacity: 0.7 },
  h3: { fontSize: 20, fontWeight: '700', lineHeight: 28 },
  h4: { fontSize: 18, fontWeight: '600', lineHeight: 24 },
  h5: { fontSize: 16, fontWeight: '600', lineHeight: 22 },
};

export const elevation = {
  none: {
    shadowColor: 'transparent',
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 },
    elevation: 0,
  },
  xs: {
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  sm: {
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  md: {
    shadowColor: '#000',
    shadowOpacity: 0.20,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  lg: {
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOpacity: 0.30,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  xxl: {
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },
  // Efectos especiales para burbujas
  bubble: {
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  bubbleLarge: {
    shadowColor: '#000',
    shadowOpacity: 0.30,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
};

export const gradients = {
  // Gradientes principales con nuevos colores modernos
  primary: ['#4F46E5', '#7C3AED'], // Índigo a púrpura
  secondary: ['#DB2777', '#EC4899'], // Rosa vibrante
  success: ['#059669', '#10B981'], // Verde esmeralda
  warning: ['#D97706', '#F59E0B'], // Naranja cálido
  danger: ['#DC2626', '#EF4444'], // Rojo vibrante
  info: ['#0891B2', '#06B6D4'], // Cian moderno
  
  // Gradientes neutros
  neutral: ['#F1F5F9', '#E2E8F0'],
  light: ['#FFFFFF', '#F8FAFC'],
  
  // Gradientes por color
  purple: ['#7C3AED', '#8B5CF6'],
  blue: ['#0891B2', '#06B6D4'],
  green: ['#059669', '#10B981'],
  orange: ['#D97706', '#F59E0B'],
  red: ['#DC2626', '#EF4444'],
  pink: ['#DB2777', '#EC4899'],
  
  // Gradientes suaves para fondos
  softBlue: ['#EBF8FF', '#DBEAFE'],
  softGreen: ['#ECFDF5', '#D1FAE5'],
  softPurple: ['#FAF5FF', '#F3E8FF'],
  softOrange: ['#FFFBEB', '#FEF3C7'],
  softRed: ['#FEF2F2', '#FEE2E2'],
  softCyan: ['#F0FDFA', '#CCFBF1'],
  softPink: ['#FDF2F8', '#FCE7F3'],
  
  // Gradientes para elementos de interfaz
  card: ['#FFFFFF', '#F8FAFC'],
  glass: ['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)'],
  overlay: ['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.3)'],
};

export const animations = {
  fast: 150,
  normal: 300,
  slow: 500,
  spring: {
    damping: 20,
    stiffness: 300,
  },
};
