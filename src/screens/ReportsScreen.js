import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import GradientBackground from '../components/GradientBackground';
import AppCard from '../components/AppCard';
import OptionsMenu from '../components/OptionsMenu';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useStore } from '../store/store';
import { spacing, colors, typography, radii } from '../theme/theme';

export default function ReportsScreen({ navigation }) {
  const { state } = useStore();
  const [selectedPeriod, setSelectedPeriod] = useState('mes');
  const [selectedReport, setSelectedReport] = useState('general');

  // Datos simulados para reportes
  const reportsData = useMemo(() => {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    
    return {
      general: {
        usuariosRegistrados: 1250,
        docentesRegistrados: 180,
        propuestasTotales: 3200,
        propuestasAceptadas: 2800,
        propuestasRechazadas: 400,
        ingresosTotales: 45000,
        comisionPlataforma: 4500,
        calificacionPromedio: 4.7,
      },
      mensual: {
        usuarios: months.map((month, index) => ({
          month,
          value: 80 + (index * 15) + (index % 3) * 20, // Crecimiento gradual
          color: colors.primary
        })),
        docentes: months.map((month, index) => ({
          month,
          value: 8 + (index * 2) + (index % 2) * 3, // Crecimiento gradual
          color: colors.success
        })),
        propuestas: months.map((month, index) => ({
          month,
          value: 120 + (index * 25) + (index % 4) * 15, // Crecimiento gradual
          color: colors.info
        })),
        ingresos: months.map((month, index) => ({
          month,
          value: 2500 + (index * 400) + (index % 3) * 300, // Crecimiento gradual
          color: colors.warning
        })),
      },
      semanal: {
        usuarios: days.map((day, index) => ({
          day,
          value: 15 + (index * 2) + (index % 2) * 5, // Patrón semanal
          color: colors.primary
        })),
        docentes: days.map((day, index) => ({
          day,
          value: 3 + (index % 3) + (index % 2) * 2, // Patrón semanal
          color: colors.success
        })),
        propuestas: days.map((day, index) => ({
          day,
          value: 25 + (index * 3) + (index % 3) * 4, // Patrón semanal
          color: colors.info
        })),
        ingresos: days.map((day, index) => ({
          day,
          value: 600 + (index * 80) + (index % 2) * 120, // Patrón semanal
          color: colors.warning
        })),
      },
      especialidades: [
        { subject: 'Matemáticas', count: 45, percentage: 25 },
        { subject: 'Inglés', count: 38, percentage: 21 },
        { subject: 'Física', count: 32, percentage: 18 },
        { subject: 'Química', count: 28, percentage: 16 },
        { subject: 'Literatura', count: 22, percentage: 12 },
        { subject: 'Biología', count: 15, percentage: 8 },
      ],
      ubicaciones: [
        { city: 'Quito', count: 65, percentage: 36 },
        { city: 'Guayaquil', count: 45, percentage: 25 },
        { city: 'Cuenca', count: 32, percentage: 18 },
        { city: 'Ambato', count: 20, percentage: 11 },
        { city: 'Manta', count: 18, percentage: 10 },
      ]
    };
  }, []);

  const getCurrentData = () => {
    const periodData = selectedPeriod === 'mes' ? reportsData.mensual : reportsData.semanal;
    return periodData[selectedReport] || periodData.usuarios;
  };

  const getChartTitle = () => {
    const titles = {
      usuarios: 'Usuarios Registrados',
      docentes: 'Docentes Registrados',
      propuestas: 'Propuestas Recibidas',
      ingresos: 'Ingresos Generados'
    };
    return titles[selectedReport] || 'Usuarios Registrados';
  };

  const getChartIcon = () => {
    const icons = {
      usuarios: '👥',
      docentes: '👨‍🏫',
      propuestas: '📨',
      ingresos: '💰'
    };
    return icons[selectedReport] || '👥';
  };

  const handleExport = (format) => {
    const reportTitle = getChartTitle();
    const message = `¿Desea exportar el reporte "${reportTitle}" en formato ${format.toUpperCase()}?`;
    
    Alert.alert(
      'Exportar Reporte',
      message,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Exportar',
          onPress: () => {
            // Simular exportación
            Alert.alert(
              'Exportación Exitosa',
              `El reporte "${reportTitle}" ha sido exportado en formato ${format.toUpperCase()}`,
              [{ text: 'OK' }]
            );
          },
        },
      ]
    );
  };

  const generalStats = [
    { 
      label: 'Docentes Activos', 
      value: reportsData.general.docentesRegistrados.toLocaleString(), 
      icon: 'school',
      iconColor: '#22C55E',
      backgroundColor: '#F0FDF4',
      change: '+8%'
    },
    { 
      label: 'Propuestas Totales', 
      value: reportsData.general.propuestasTotales.toLocaleString(), 
      icon: 'mail',
      iconColor: '#0EA5E9',
      backgroundColor: '#FEF3C7',
      change: '+15%'
    },
  ];

  return (
    <GradientBackground variant="white" theme="adminDashboard">
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.welcomeSection}>
              <View style={styles.welcomeIconContainer}>
                <Text style={styles.welcomeEmoji}>📊</Text>
              </View>
              <View style={styles.welcomeTextContainer}>
                <Text style={styles.welcomeText}>Reportes y Análisis</Text>
                <Text style={styles.welcomeSubtext}>Estadísticas de la plataforma</Text>
              </View>
            </View>
            <OptionsMenu navigation={navigation} theme="adminDashboard" />
          </View>
        </View>

        {/* Estadísticas generales */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>📈 Resumen General</Text>
          <View style={styles.statsGrid}>
            {generalStats.map((stat, index) => (
              <View key={index} style={[styles.statCard, { backgroundColor: stat.backgroundColor }]}>
                <View style={styles.statHeader}>
                  <View style={[styles.statIconContainer, { backgroundColor: stat.iconColor }]}>
                    <Ionicons name={stat.icon} size={24} color="white" />
                  </View>
                  <Text style={[styles.statChange, { color: '#10B981' }]}>{stat.change}</Text>
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Selector de reporte simplificado */}
        <AppCard style={styles.reportCard}>
          <Text style={styles.cardTitle}>📊 Tipo de Reporte</Text>
          <View style={styles.reportButtons}>
            {[
              { key: 'docentes', label: 'Docentes', icon: '👨‍🏫' },
              { key: 'propuestas', label: 'Propuestas', icon: '📨' }
            ].map((report) => (
              <TouchableOpacity
                key={report.key}
                style={[
                  styles.reportButton,
                  selectedReport === report.key && styles.reportButtonActive
                ]}
                onPress={() => setSelectedReport(report.key)}
              >
                <Text style={styles.reportButtonIcon}>{report.icon}</Text>
                <Text style={[
                  styles.reportButtonText,
                  selectedReport === report.key && styles.reportButtonTextActive
                ]}>
                  {report.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </AppCard>

        {/* Sección de exportación */}
        <AppCard style={styles.exportCard}>
          <View style={styles.exportHeader}>
            <Text style={styles.cardTitle}>
              {getChartIcon()} {getChartTitle()}
            </Text>
            <Text style={styles.exportSubtitle}>
              Exportar datos del reporte seleccionado
            </Text>
          </View>
          
          <View style={styles.exportButtons}>
            <TouchableOpacity 
              style={[styles.exportButton, styles.excelButton]}
              onPress={() => handleExport('excel')}
            >
              <MaterialIcons name="table-chart" size={20} color="white" />
              <Text style={styles.exportButtonText}>Excel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.exportButton, styles.pdfButton]}
              onPress={() => handleExport('pdf')}
            >
              <MaterialIcons name="picture-as-pdf" size={20} color="white" />
              <Text style={styles.exportButtonText}>PDF</Text>
            </TouchableOpacity>
          </View>
        </AppCard>

        {/* Distribuciones mejoradas */}
        <View style={styles.distributionsSection}>
          <Text style={styles.sectionTitle}>📊 Distribuciones</Text>
          
          <View style={styles.distributionsContainer}>
            {/* Especialidades más populares */}
            <AppCard style={styles.distributionCard}>
              <Text style={styles.distributionTitle}>📚 Especialidades Más Populares</Text>
              <View style={styles.distributionList}>
                {reportsData.especialidades.map((specialty, index) => (
                  <View key={index} style={styles.distributionItem}>
                    <View style={styles.distributionInfo}>
                      <Text style={styles.distributionName}>{specialty.subject}</Text>
                      <Text style={styles.distributionCount}>{specialty.count}</Text>
                    </View>
                    <View style={styles.distributionBar}>
                      <View 
                        style={[
                          styles.distributionBarFill, 
                          { width: `${specialty.percentage}%` }
                        ]} 
                      />
                    </View>
                    <Text style={styles.distributionPercentage}>{specialty.percentage}%</Text>
                  </View>
                ))}
              </View>
            </AppCard>

            {/* Ubicaciones */}
            <AppCard style={styles.distributionCard}>
              <Text style={styles.distributionTitle}>📍 Distribución por Ubicación</Text>
              <View style={styles.distributionList}>
                {reportsData.ubicaciones.map((location, index) => (
                  <View key={index} style={styles.distributionItem}>
                    <View style={styles.distributionInfo}>
                      <Text style={styles.distributionName}>{location.city}</Text>
                      <Text style={styles.distributionCount}>{location.count} docentes</Text>
                    </View>
                    <View style={styles.distributionBar}>
                      <View 
                        style={[
                          styles.distributionBarFill, 
                          { width: `${location.percentage}%`, backgroundColor: '#10B981' }
                        ]} 
                      />
                    </View>
                    <Text style={styles.distributionPercentage}>{location.percentage}%</Text>
                  </View>
                ))}
              </View>
            </AppCard>
          </View>
        </View>
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: spacing.xl,
    paddingBottom: 100,
  },
  header: {
    marginBottom: spacing.lg,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  welcomeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  welcomeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.themes.adminDashboard.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  welcomeEmoji: {
    fontSize: 20,
  },
  welcomeTextContainer: {
    flex: 1,
  },
  welcomeText: {
    ...typography.title,
    color: '#1F2937',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 2,
  },
  welcomeSubtext: {
    ...typography.bodySmall,
    color: '#6B7280',
    fontSize: 14,
  },
  roleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.themes.adminDashboard.card,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.themes.adminDashboard.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  roleButtonText: {
    color: colors.themes.adminDashboard.primary,
    fontWeight: '600',
    marginLeft: spacing.xs,
    fontSize: 13,
  },
  statsSection: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.subtitle,
    color: '#1F2937',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.lg,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    padding: spacing.xl,
    borderRadius: radii.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 0,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  statChange: {
    ...typography.caption,
    fontSize: 12,
    fontWeight: '600',
  },
  statValue: {
    ...typography.title,
    color: '#1F2937',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...typography.caption,
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  cardTitle: {
    ...typography.subtitle,
    color: '#1F2937',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: spacing.lg,
  },
  reportCard: {
    marginBottom: spacing.lg,
  },
  reportButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  reportButton: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: spacing.md,
    backgroundColor: colors.themes.adminDashboard.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.themes.adminDashboard.primary,
    alignItems: 'center',
  },
  reportButtonActive: {
    backgroundColor: colors.themes.adminDashboard.primary,
  },
  reportButtonIcon: {
    fontSize: 20,
    marginBottom: spacing.xs,
  },
  reportButtonText: {
    ...typography.bodySmall,
    color: colors.themes.adminDashboard.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  reportButtonTextActive: {
    color: 'white',
  },
  exportCard: {
    marginBottom: spacing.lg,
  },
  exportHeader: {
    marginBottom: spacing.lg,
  },
  exportSubtitle: {
    ...typography.bodySmall,
    color: '#6B7280',
    fontSize: 14,
    marginTop: spacing.xs,
  },
  exportButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  exportButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  excelButton: {
    backgroundColor: '#10B981',
  },
  pdfButton: {
    backgroundColor: '#EF4444',
  },
  exportButtonText: {
    ...typography.body,
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  distributionsSection: {
    marginBottom: spacing.lg,
  },
  distributionsContainer: {
    gap: spacing.lg,
  },
  distributionCard: {
    marginBottom: 0,
  },
  distributionTitle: {
    ...typography.subtitle,
    color: '#1F2937',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: spacing.lg,
  },
  distributionList: {
    gap: spacing.lg,
  },
  distributionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  distributionInfo: {
    width: 100,
  },
  distributionName: {
    ...typography.bodySmall,
    color: '#1F2937',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
  },
  distributionCount: {
    ...typography.caption,
    color: '#6B7280',
    fontSize: 11,
  },
  distributionBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 3,
    overflow: 'hidden',
  },
  distributionBarFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
  },
  distributionPercentage: {
    ...typography.caption,
    color: '#1F2937',
    fontSize: 12,
    fontWeight: '600',
    width: 35,
    textAlign: 'right',
  },
});
