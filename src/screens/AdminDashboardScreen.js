import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import GradientBackground from '../components/GradientBackground';
import OptionsMenu from '../components/OptionsMenu';
import { ProposalsDoughnutChart } from '../components/NativeCharts';
import { useStore } from '../store/store';
import { spacing, colors, typography, radii, elevation } from '../theme/theme';
import { Ionicons } from '@expo/vector-icons';

export default function AdminDashboardScreen({ navigation }) {
  const { state } = useStore();

  const metrics = useMemo(() => {
    const usuariosRegistrados = state.userProfile ? 1 : 0;
    const docentesRegistrados = state.teachers.length;
    const propuestasTotales = state.proposals.length;
    const propuestasAceptadas = state.proposals.filter((p) => p.status === 'aceptada').length;
    const propuestasRechazadas = state.proposals.filter((p) => p.status === 'rechazada').length;
    const propuestasPendientes = propuestasTotales - propuestasAceptadas - propuestasRechazadas;
    
    // Métricas adicionales simuladas
    const ingresosTotales = propuestasAceptadas * 15000; // $15,000 por propuesta aceptada
    
    return {
      usuariosRegistrados,
      docentesRegistrados,
      propuestasAceptadas,
      propuestasRechazadas,
      propuestasPendientes,
      ingresosTotales,
    };
  }, [state.userProfile, state.teachers, state.proposals]);

  return (
    <GradientBackground variant="white" theme="adminDashboard">
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Compacto */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.welcomeSection}>
              <View style={styles.welcomeIcon}>
                <Ionicons name="analytics" size={32} color={colors.primary} />
              </View>
              <View style={styles.welcomeTextContainer}>
                <Text style={styles.welcomeText}>Dashboard</Text>
                <Text style={styles.welcomeSubtext}>Panel de control del sistema</Text>
              </View>
            </View>
            <View style={styles.headerActions}>
              <OptionsMenu navigation={navigation} theme="adminDashboard" />
            </View>
          </View>
        </View>

        {/* Métricas Principales - Diseño Simple */}
        <View style={styles.metricsSection}>
          <Text style={styles.sectionTitle}>📊 Resumen General</Text>
          <View style={styles.metricsGrid}>
            {/* Primera fila */}
            <View style={styles.metricsRow}>
              <View style={styles.metricCard}>
                <Ionicons name="people" size={32} color="#0EA5E9" />
                <Text style={styles.metricNumber}>{metrics.usuariosRegistrados}</Text>
                <Text style={styles.metricLabel}>Usuarios</Text>
              </View>
              
              <View style={styles.metricCard}>
                <Ionicons name="school" size={32} color="#22C55E" />
                <Text style={styles.metricNumber}>{metrics.docentesRegistrados}</Text>
                <Text style={styles.metricLabel}>Docentes</Text>
              </View>
            </View>
            
            {/* Segunda fila */}
            <View style={styles.metricsRow}>
              <View style={styles.metricCard}>
                <Ionicons name="cash" size={32} color="#F59E0B" />
                <Text style={styles.metricNumber}>${(metrics.ingresosTotales / 1000).toFixed(0)}k</Text>
                <Text style={styles.metricLabel}>Ingresos</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Estado de Propuestas - Centrado */}
        <View style={styles.progressSection}>
          <Text style={styles.sectionTitle}>📈 Estado de Propuestas</Text>
          <View style={styles.progressContainer}>
            <ProposalsDoughnutChart metrics={metrics} />
          </View>
        </View>
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  
  // Header compacto
  header: {
    marginBottom: spacing.xl,
    paddingTop: spacing.lg,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  welcomeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  welcomeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  welcomeTextContainer: {
    flex: 1,
  },
  welcomeText: {
    ...typography.h4,
    color: colors.neutral900,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  welcomeSubtext: {
    ...typography.bodySmall,
    color: colors.neutral600,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    ...elevation.sm,
  },

  // Secciones
  metricsSection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h5,
    color: colors.neutral900,
    fontWeight: '700',
    marginBottom: spacing.lg,
    fontSize: 18,
  },

  // Grid de métricas simple
  metricsGrid: {
    gap: spacing.lg,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  metricCard: {
    flex: 1,
    backgroundColor: colors.white,
    padding: spacing.xl,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    minHeight: 100,
  },
  metricNumber: {
    ...typography.h3,
    color: colors.neutral900,
    fontWeight: '700',
    fontSize: 24,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  metricLabel: {
    ...typography.bodySmall,
    color: colors.neutral600,
    fontWeight: '500',
    fontSize: 13,
    textAlign: 'center',
  },

  // Estado de propuestas compacto
  progressSection: {
    marginBottom: spacing.xl,
  },
  progressContainer: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: spacing.xl,
    ...elevation.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
