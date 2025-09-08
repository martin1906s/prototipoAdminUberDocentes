import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Platform,
  Dimensions
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import GradientBackground from '../components/GradientBackground';
import AppCard from '../components/AppCard';
import AppButton from '../components/AppButton';
import { useStore } from '../store/store';
import { colors, typography, spacing, radii, elevation } from '../theme/theme';

const { width } = Dimensions.get('window');

export default function AnalyticsScreen({ navigation }) {
  const { state } = useStore();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('overview');

  const periodOptions = [
    { label: '7 días', value: 'week' },
    { label: '30 días', value: 'month' },
    { label: '90 días', value: 'quarter' },
    { label: '1 año', value: 'year' }
  ];

  const metricOptions = [
    { label: 'Resumen', value: 'overview' },
    { label: 'Propuestas', value: 'proposals' },
    { label: 'Docentes', value: 'teachers' },
    { label: 'Ingresos', value: 'revenue' }
  ];

  // Calcular métricas
  const calculateMetrics = () => {
    const totalUsers = state.proposals.reduce((acc, proposal) => {
      const existingUser = acc.find(u => u.email === proposal.user.email);
      if (!existingUser) {
        acc.push(proposal.user);
      }
      return acc;
    }, []).length;

    const totalTeachers = state.teachers.length;
    const totalProposals = state.proposals.length;
    const acceptedProposals = state.proposals.filter(p => p.estado === 'aceptada').length;
    const pendingProposals = state.proposals.filter(p => p.estado === 'pendiente').length;
    const rejectedProposals = state.proposals.filter(p => p.estado === 'rechazada').length;
    
    const totalRevenue = acceptedProposals * 15000; // $15,000 por propuesta aceptada
    const averageProposalValue = acceptedProposals > 0 ? totalRevenue / acceptedProposals : 0;
    
    const conversionRate = totalProposals > 0 ? (acceptedProposals / totalProposals) * 100 : 0;
    
    // Calcular crecimiento (simulado)
    const growthRate = 12.5; // Simulado
    
    return {
      totalUsers,
      totalTeachers,
      totalProposals,
      acceptedProposals,
      pendingProposals,
      rejectedProposals,
      totalRevenue,
      averageProposalValue,
      conversionRate,
      growthRate
    };
  };

  const metrics = calculateMetrics();

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const StatCard = ({ title, value, subtitle, icon, color, trend }) => (
    <AppCard style={styles.statCard}>
      <View style={styles.statHeader}>
        <View style={[styles.statIcon, { backgroundColor: color }]}>
          <MaterialIcons name={icon} size={24} color={colors.white} />
        </View>
        {trend && (
          <View style={[styles.trendBadge, { backgroundColor: trend > 0 ? colors.success : colors.danger }]}>
            <Text style={styles.trendText}>
              {trend > 0 ? '+' : ''}{trend}%
            </Text>
          </View>
        )}
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </AppCard>
  );

  const ChartCard = ({ title, children }) => (
    <AppCard style={styles.chartCard}>
      <Text style={styles.chartTitle}>{title}</Text>
      {children}
    </AppCard>
  );

  const SimpleBarChart = ({ data, maxValue }) => (
    <View style={styles.barChart}>
      {data.map((item, index) => (
        <View key={index} style={styles.barContainer}>
          <View style={styles.barWrapper}>
            <View 
              style={[
                styles.bar, 
                { 
                  height: (item.value / maxValue) * 100,
                  backgroundColor: item.color 
                }
              ]} 
            />
          </View>
          <Text style={styles.barLabel}>{item.label}</Text>
          <Text style={styles.barValue}>{item.value}</Text>
        </View>
      ))}
    </View>
  );

  const ProposalStatusChart = () => {
    const data = [
      { label: 'Aceptadas', value: metrics.acceptedProposals, color: colors.success },
      { label: 'Pendientes', value: metrics.pendingProposals, color: colors.warning },
      { label: 'Rechazadas', value: metrics.rejectedProposals, color: colors.danger }
    ];
    const maxValue = Math.max(...data.map(d => d.value));

    return (
      <ChartCard title="Estado de Propuestas">
        <SimpleBarChart data={data} maxValue={maxValue} />
      </ChartCard>
    );
  };

  const RevenueChart = () => {
    const data = [
      { label: 'Ene', value: 45000, color: colors.primary },
      { label: 'Feb', value: 52000, color: colors.primary },
      { label: 'Mar', value: 48000, color: colors.primary },
      { label: 'Abr', value: 61000, color: colors.primary },
      { label: 'May', value: 55000, color: colors.primary },
      { label: 'Jun', value: metrics.totalRevenue, color: colors.success }
    ];
    const maxValue = Math.max(...data.map(d => d.value));

    return (
      <ChartCard title="Ingresos Mensuales">
        <SimpleBarChart data={data} maxValue={maxValue} />
      </ChartCard>
    );
  };

  const TeacherPerformanceChart = () => {
    const teacherData = state.teachers.map(teacher => ({
      name: teacher.name.split(' ')[0], // Solo primer nombre
      proposals: state.proposals.filter(p => p.teacherId === teacher.id).length,
      accepted: state.proposals.filter(p => p.teacherId === teacher.id && p.estado === 'aceptada').length
    }));

    const data = teacherData.slice(0, 5).map(teacher => ({
      label: teacher.name,
      value: teacher.accepted,
      color: colors.accent
    }));
    const maxValue = Math.max(...data.map(d => d.value), 1);

    return (
      <ChartCard title="Rendimiento de Docentes">
        <SimpleBarChart data={data} maxValue={maxValue} />
      </ChartCard>
    );
  };

  const OverviewMetrics = () => (
    <View style={styles.metricsGrid}>
      <StatCard
        title="Usuarios Totales"
        value={metrics.totalUsers}
        icon="people"
        color={colors.primary}
        trend={metrics.growthRate}
      />
      <StatCard
        title="Docentes Activos"
        value={metrics.totalTeachers}
        icon="school"
        color={colors.success}
        trend={8.2}
      />
      <StatCard
        title="Propuestas Totales"
        value={metrics.totalProposals}
        icon="description"
        color={colors.warning}
        trend={15.3}
      />
      <StatCard
        title="Ingresos Totales"
        value={`$${(metrics.totalRevenue / 1000).toFixed(0)}k`}
        subtitle="Este mes"
        icon="attach-money"
        color={colors.accent}
        trend={22.1}
      />
    </View>
  );

  const ProposalMetrics = () => (
    <View style={styles.metricsGrid}>
      <StatCard
        title="Tasa de Conversión"
        value={`${metrics.conversionRate.toFixed(1)}%`}
        subtitle="Propuestas aceptadas"
        icon="trending-up"
        color={colors.success}
      />
      <StatCard
        title="Valor Promedio"
        value={`$${metrics.averageProposalValue.toFixed(0)}`}
        subtitle="Por propuesta"
        icon="monetization-on"
        color={colors.primary}
      />
      <StatCard
        title="Propuestas Pendientes"
        value={metrics.pendingProposals}
        subtitle="Requieren atención"
        icon="schedule"
        color={colors.warning}
      />
      <StatCard
        title="Tiempo Promedio"
        value="2.3 días"
        subtitle="Respuesta"
        icon="access-time"
        color={colors.accent}
      />
    </View>
  );

  const renderContent = () => {
    switch (selectedMetric) {
      case 'proposals':
        return (
          <>
            <ProposalMetrics />
            <ProposalStatusChart />
          </>
        );
      case 'teachers':
        return (
          <>
            <TeacherPerformanceChart />
            <AppCard style={styles.teacherListCard}>
              <Text style={styles.cardTitle}>Top Docentes</Text>
              {state.teachers.slice(0, 5).map((teacher, index) => {
                const teacherProposals = state.proposals.filter(p => p.teacherId === teacher.id);
                const acceptedProposals = teacherProposals.filter(p => p.estado === 'aceptada').length;
                return (
                  <View key={teacher.id} style={styles.teacherItem}>
                    <View style={styles.teacherRank}>
                      <Text style={styles.rankNumber}>{index + 1}</Text>
                    </View>
                    <View style={styles.teacherInfo}>
                      <Text style={styles.teacherName}>{teacher.name}</Text>
                      <Text style={styles.teacherSubject}>{teacher.subject}</Text>
                    </View>
                    <View style={styles.teacherStats}>
                      <Text style={styles.teacherProposals}>{acceptedProposals} aceptadas</Text>
                      <Text style={styles.teacherRating}>⭐ {teacher.rating}</Text>
                    </View>
                  </View>
                );
              })}
            </AppCard>
          </>
        );
      case 'revenue':
        return (
          <>
            <RevenueChart />
            <AppCard style={styles.revenueCard}>
              <Text style={styles.cardTitle}>Análisis de Ingresos</Text>
              <View style={styles.revenueItem}>
                <Text style={styles.revenueLabel}>Ingresos Totales:</Text>
                <Text style={styles.revenueValue}>${metrics.totalRevenue.toLocaleString()}</Text>
              </View>
              <View style={styles.revenueItem}>
                <Text style={styles.revenueLabel}>Propuestas Aceptadas:</Text>
                <Text style={styles.revenueValue}>{metrics.acceptedProposals}</Text>
              </View>
              <View style={styles.revenueItem}>
                <Text style={styles.revenueLabel}>Valor por Propuesta:</Text>
                <Text style={styles.revenueValue}>$15,000</Text>
              </View>
              <View style={styles.revenueItem}>
                <Text style={styles.revenueLabel}>Proyección Mensual:</Text>
                <Text style={[styles.revenueValue, { color: colors.success }]}>
                  ${(metrics.totalRevenue * 1.2).toLocaleString()}
                </Text>
              </View>
            </AppCard>
          </>
        );
      default:
        return (
          <>
            <OverviewMetrics />
            <ProposalStatusChart />
            <RevenueChart />
          </>
        );
    }
  };

  return (
    <GradientBackground variant="white" theme="adminDashboard">
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Analíticas Avanzadas</Text>
          <TouchableOpacity style={styles.exportButton}>
            <MaterialIcons name="file-download" size={24} color={colors.white} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.content}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Filtros de período */}
          <AppCard style={styles.filtersCard}>
            <Text style={styles.filterTitle}>Período</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {periodOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.filterChip,
                    selectedPeriod === option.value && styles.filterChipActive
                  ]}
                  onPress={() => setSelectedPeriod(option.value)}
                >
                  <Text style={[
                    styles.filterChipText,
                    selectedPeriod === option.value && styles.filterChipTextActive
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </AppCard>

          {/* Filtros de métricas */}
          <AppCard style={styles.filtersCard}>
            <Text style={styles.filterTitle}>Métricas</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {metricOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.filterChip,
                    selectedMetric === option.value && styles.filterChipActive
                  ]}
                  onPress={() => setSelectedMetric(option.value)}
                >
                  <Text style={[
                    styles.filterChipText,
                    selectedMetric === option.value && styles.filterChipTextActive
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </AppCard>

          {/* Contenido dinámico */}
          {renderContent()}
        </ScrollView>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    backgroundColor: colors.primary,
  },
  backButton: {
    padding: spacing.sm,
  },
  headerTitle: {
    ...typography.title,
    color: colors.white,
    fontSize: 20,
    fontWeight: '700',
  },
  exportButton: {
    padding: spacing.sm,
  },
  content: {
    flex: 1,
    padding: spacing.xl,
  },
  filtersCard: {
    marginBottom: spacing.lg,
  },
  filterTitle: {
    ...typography.bodySmall,
    color: colors.neutral700,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
    backgroundColor: colors.neutral100,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.neutral200,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    ...typography.caption,
    color: colors.neutral600,
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: colors.white,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  statCard: {
    width: '48%',
    marginBottom: spacing.md,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trendBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radii.sm,
  },
  trendText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: '600',
    fontSize: 10,
  },
  statValue: {
    ...typography.title,
    fontSize: 24,
    fontWeight: '800',
    color: colors.neutral900,
    marginBottom: spacing.xs,
  },
  statTitle: {
    ...typography.bodySmall,
    color: colors.neutral700,
    fontWeight: '600',
  },
  statSubtitle: {
    ...typography.caption,
    color: colors.neutral500,
    marginTop: spacing.xs,
  },
  chartCard: {
    marginBottom: spacing.lg,
  },
  chartTitle: {
    ...typography.subtitle,
    color: colors.neutral900,
    fontWeight: '700',
    marginBottom: spacing.lg,
  },
  barChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: spacing.xs,
  },
  barWrapper: {
    height: 80,
    justifyContent: 'flex-end',
    marginBottom: spacing.sm,
  },
  bar: {
    width: 20,
    borderRadius: 10,
    minHeight: 4,
  },
  barLabel: {
    ...typography.caption,
    color: colors.neutral600,
    textAlign: 'center',
    fontSize: 10,
  },
  barValue: {
    ...typography.caption,
    color: colors.neutral900,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  teacherListCard: {
    marginBottom: spacing.lg,
  },
  cardTitle: {
    ...typography.subtitle,
    color: colors.neutral900,
    fontWeight: '700',
    marginBottom: spacing.lg,
  },
  teacherItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral100,
  },
  teacherRank: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  rankNumber: {
    ...typography.caption,
    color: colors.white,
    fontWeight: '700',
  },
  teacherInfo: {
    flex: 1,
  },
  teacherName: {
    ...typography.body,
    color: colors.neutral900,
    fontWeight: '600',
  },
  teacherSubject: {
    ...typography.bodySmall,
    color: colors.neutral600,
  },
  teacherStats: {
    alignItems: 'flex-end',
  },
  teacherProposals: {
    ...typography.caption,
    color: colors.neutral600,
  },
  teacherRating: {
    ...typography.caption,
    color: colors.accent,
    fontWeight: '600',
  },
  revenueCard: {
    marginBottom: spacing.lg,
  },
  revenueItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral100,
  },
  revenueLabel: {
    ...typography.body,
    color: colors.neutral700,
  },
  revenueValue: {
    ...typography.body,
    color: colors.neutral900,
    fontWeight: '600',
  },
});
