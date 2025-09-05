import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../store/store';
import { COLORS, FONT_SIZES, FONT_WEIGHTS, SPACING, CONTAINER_SPACING, BORDER_RADIUS, SHADOWS } from '../utils/constants';
import CustomModal from '../components/CustomModal';
import { useModal } from '../hooks/useModal';

export default function AdminDashboardScreen({ navigation }) {
  const { user, logout } = useAuth();
  const { state } = useStore();
  const [refreshing, setRefreshing] = useState(false);
  const { modalVisible, modalConfig, showConfirm, hideModal } = useModal();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTeachers: 0,
    totalProposals: 0,
    pendingProposals: 0,
    acceptedProposals: 0,
    rejectedProposals: 0,
    totalRevenue: 0
  });

  const [recentProposals, setRecentProposals] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    // Calcular métricas basadas en el estado actual
    const totalUsers = state.userProfile ? 1 : 0;
    const totalTeachers = state.teachers.length;
    const totalProposals = state.proposals.length;
    const acceptedProposals = state.proposals.filter((p) => p.status === 'aceptada').length;
    const rejectedProposals = state.proposals.filter((p) => p.status === 'rechazada').length;
    const pendingProposals = totalProposals - acceptedProposals - rejectedProposals;
    const totalRevenue = acceptedProposals * 15000; // $15,000 por propuesta aceptada

    setStats({
      totalUsers,
      totalTeachers,
      totalProposals,
      pendingProposals,
      acceptedProposals,
      rejectedProposals,
      totalRevenue
    });

    // Simular propuestas recientes
    setRecentProposals([
      {
        id: '1',
        teacherName: 'María García',
        studentName: 'Juan Pérez',
        subject: 'Matemáticas',
        date: '2024-01-15',
        status: 'aceptada',
        price: 25
      },
      {
        id: '2',
        teacherName: 'Carlos López',
        studentName: 'Ana Silva',
        subject: 'Física',
        date: '2024-01-16',
        status: 'pendiente',
        price: 30
      },
      {
        id: '3',
        teacherName: 'Ana Rodríguez',
        studentName: 'Pedro González',
        subject: 'Química',
        date: '2024-01-17',
        status: 'rechazada',
        price: 28
      }
    ]);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const handleLogout = () => {
    showConfirm(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      logout
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'aceptada': return COLORS.success;
      case 'pendiente': return COLORS.warning;
      case 'rechazada': return COLORS.danger;
      default: return COLORS.gray[500];
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'aceptada': return 'Aceptada';
      case 'pendiente': return 'Pendiente';
      case 'rechazada': return 'Rechazada';
      default: return 'Desconocido';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short'
    });
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={COLORS.gradientSecondary}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.welcomeText}>¡Hola, {user?.name}! 👋</Text>
            <Text style={styles.subtitle}>Panel de Administración</Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LinearGradient
              colors={[COLORS.danger, COLORS.dangerDark]}
              style={styles.logoutButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="log-out-outline" size={20} color={COLORS.white} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Estadísticas */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <LinearGradient
              colors={[COLORS.primary, COLORS.primaryDark]}
              style={styles.statCardGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.statIcon}>
                <Ionicons name="people-outline" size={24} color={COLORS.white} />
              </View>
              <Text style={styles.statNumber}>{stats.totalUsers}</Text>
              <Text style={styles.statLabel}>Usuarios</Text>
            </LinearGradient>
          </View>

          <View style={styles.statCard}>
            <LinearGradient
              colors={[COLORS.warning, COLORS.warningDark]}
              style={styles.statCardGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.statIcon}>
                <Ionicons name="school-outline" size={24} color={COLORS.white} />
              </View>
              <Text style={styles.statNumber}>{stats.totalTeachers}</Text>
              <Text style={styles.statLabel}>Docentes</Text>
            </LinearGradient>
          </View>

          <View style={styles.statCard}>
            <LinearGradient
              colors={[COLORS.success, COLORS.successDark]}
              style={styles.statCardGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.statIcon}>
                <Ionicons name="document-text-outline" size={24} color={COLORS.white} />
              </View>
              <Text style={styles.statNumber}>{stats.totalProposals}</Text>
              <Text style={styles.statLabel}>Propuestas</Text>
            </LinearGradient>
          </View>

          <View style={styles.statCard}>
            <LinearGradient
              colors={[COLORS.secondary, COLORS.secondaryDark]}
              style={styles.statCardGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.statIcon}>
                <Ionicons name="cash-outline" size={24} color={COLORS.white} />
              </View>
              <Text style={styles.statNumber}>${(stats.totalRevenue / 1000).toFixed(0)}k</Text>
              <Text style={styles.statLabel}>Ingresos</Text>
            </LinearGradient>
          </View>
        </View>

        {/* Acciones rápidas */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => showConfirm('Próximamente', 'Gestión de docentes', () => {})}
            >
              <LinearGradient
                colors={COLORS.gradientPrimary}
                style={styles.quickActionGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="people" size={24} color={COLORS.white} />
                <Text style={styles.quickActionText}>Gestionar Docentes</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => showConfirm('Próximamente', 'Gestión de propuestas', () => {})}
            >
              <LinearGradient
                colors={COLORS.gradientAccent}
                style={styles.quickActionGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="document-text" size={24} color={COLORS.white} />
                <Text style={styles.quickActionText}>Gestionar Propuestas</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => showConfirm('Próximamente', 'Reportes y estadísticas', () => {})}
            >
              <LinearGradient
                colors={[COLORS.accent, COLORS.accentDark]}
                style={styles.quickActionGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="analytics" size={24} color={COLORS.white} />
                <Text style={styles.quickActionText}>Reportes</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => showConfirm('Próximamente', 'Configuración del sistema', () => {})}
            >
              <LinearGradient
                colors={[COLORS.gray[600], COLORS.gray[700]]}
                style={styles.quickActionGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="settings" size={24} color={COLORS.white} />
                <Text style={styles.quickActionText}>Configuración</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Propuestas recientes */}
        <View style={styles.recentContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Propuestas Recientes</Text>
            <TouchableOpacity onPress={() => showConfirm('Próximamente', 'Vista detallada de propuestas', () => {})}>
              <Text style={styles.seeAllText}>Ver todas</Text>
            </TouchableOpacity>
          </View>

          {recentProposals.map((proposal) => (
            <View key={proposal.id} style={styles.proposalCard}>
              <View style={styles.proposalHeader}>
                <Text style={styles.proposalSubject}>{proposal.subject}</Text>
                <LinearGradient
                  colors={[getStatusColor(proposal.status), getStatusColor(proposal.status)]}
                  style={styles.statusBadge}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.statusText}>{getStatusText(proposal.status)}</Text>
                </LinearGradient>
              </View>
              
              <View style={styles.proposalDetails}>
                <View style={styles.proposalDetail}>
                  <Ionicons name="person-outline" size={16} color={COLORS.primary} />
                  <Text style={styles.proposalDetailText}>{proposal.teacherName}</Text>
                </View>
                <View style={styles.proposalDetail}>
                  <Ionicons name="person-circle-outline" size={16} color={COLORS.warning} />
                  <Text style={styles.proposalDetailText}>{proposal.studentName}</Text>
                </View>
                <View style={styles.proposalDetail}>
                  <Ionicons name="calendar-outline" size={16} color={COLORS.accent} />
                  <Text style={styles.proposalDetailText}>{formatDate(proposal.date)}</Text>
                </View>
                <View style={styles.proposalDetail}>
                  <Ionicons name="cash-outline" size={16} color={COLORS.secondary} />
                  <Text style={styles.proposalDetailText}>${proposal.price}/hora</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Modal personalizado */}
      <CustomModal
        visible={modalVisible}
        onClose={hideModal}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
        buttons={modalConfig.buttons}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray[50],
    ...(Platform.OS === 'web' && {
      height: '100vh',
      overflow: 'hidden',
    }),
  },
  headerGradient: {
    paddingTop: SPACING['5xl'],
    paddingBottom: SPACING['2xl'],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: CONTAINER_SPACING.screen,
  },
  headerContent: {
    flex: 1,
  },
  welcomeText: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.white,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: FONT_SIZES.base,
    color: COLORS.white,
    marginTop: SPACING.xs,
    opacity: 0.9,
  },
  logoutButton: {
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
  },
  logoutButtonGradient: {
    padding: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContainer: {
    flex: 1,
    marginTop: -SPACING['1xl'],
    ...(Platform.OS === 'web' && {
      overflowY: 'auto',
      overflowX: 'hidden',
    }),
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: CONTAINER_SPACING.screen,
    marginTop: SPACING['4xl'],
    paddingBottom: SPACING['4xl'],
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    marginBottom: SPACING['2xl'],
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
    ...SHADOWS.lg,
  },
  statCardGradient: {
    padding: CONTAINER_SPACING.card,
    alignItems: 'center',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  statNumber: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.white,
    marginBottom: SPACING.xs,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  statLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.white,
    textAlign: 'center',
    opacity: 0.9,
  },
  quickActionsContainer: {
    paddingHorizontal: CONTAINER_SPACING.screen,
    paddingBottom: SPACING['3xl'],
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.gray[800],
    marginBottom: SPACING['2xl'],
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    width: '48%',
    marginBottom: SPACING['2xl'],
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
    ...SHADOWS.md,
  },
  quickActionGradient: {
    padding: CONTAINER_SPACING.button,
    alignItems: 'center',
    gap: SPACING.sm,
  },
  quickActionText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.white,
    textAlign: 'center',
  },
  recentContainer: {
    paddingHorizontal: CONTAINER_SPACING.screen,
    paddingBottom: SPACING['6xl'],
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING['2xl'],
  },
  seeAllText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  proposalCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: CONTAINER_SPACING.card,
    marginBottom: SPACING['2xl'],
    ...SHADOWS.md,
  },
  proposalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  proposalSubject: {
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.gray[800],
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.lg,
  },
  statusText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.white,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  proposalDetails: {
    gap: SPACING.md,
  },
  proposalDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  proposalDetailText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[600],
  },
  // Estilos específicos para web
  scrollContent: {
    ...(Platform.OS === 'web' && {
      minHeight: '100%',
      paddingBottom: SPACING['6xl'],
    }),
  },
  // Mejorar botones para web
  quickActionButton: {
    width: '48%',
    marginBottom: SPACING['2xl'],
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
    ...SHADOWS.md,
    ...(Platform.OS === 'web' && {
      cursor: 'pointer',
      userSelect: 'none',
      transition: 'all 0.2s ease',
    }),
  },
  logoutButton: {
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    ...(Platform.OS === 'web' && {
      cursor: 'pointer',
      userSelect: 'none',
      transition: 'all 0.2s ease',
    }),
  },
});
