import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../store/store';
import { COLORS, FONT_SIZES, FONT_WEIGHTS, SPACING, CONTAINER_SPACING, BORDER_RADIUS, SHADOWS } from '../utils/constants';

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
          color: COLORS.primary
        })),
        docentes: months.map((month, index) => ({
          month,
          value: 8 + (index * 2) + (index % 2) * 3, // Crecimiento gradual
          color: COLORS.success
        })),
        propuestas: months.map((month, index) => ({
          month,
          value: 120 + (index * 25) + (index % 4) * 15, // Crecimiento gradual
          color: COLORS.info
        })),
        ingresos: months.map((month, index) => ({
          month,
          value: 2500 + (index * 400) + (index % 3) * 300, // Crecimiento gradual
          color: COLORS.warning
        })),
      },
      semanal: {
        usuarios: days.map((day, index) => ({
          day,
          value: 15 + (index * 2) + (index % 2) * 5, // Patrón semanal
          color: COLORS.primary
        })),
        docentes: days.map((day, index) => ({
          day,
          value: 3 + (index % 3) + (index % 2) * 2, // Patrón semanal
          color: COLORS.success
        })),
        propuestas: days.map((day, index) => ({
          day,
          value: 25 + (index * 3) + (index % 3) * 4, // Patrón semanal
          color: COLORS.info
        })),
        ingresos: days.map((day, index) => ({
          day,
          value: 600 + (index * 80) + (index % 2) * 120, // Patrón semanal
          color: COLORS.warning
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
    <View style={styles.container}>
      <LinearGradient
        colors={COLORS.gradientAccent}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.welcomeText}>📊 Reportes y Análisis</Text>
            <Text style={styles.subtitle}>Estadísticas de la plataforma</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >

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
        <View style={styles.reportCard}>
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
        </View>

        {/* Sección de exportación */}
        <View style={styles.exportCard}>
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
              <Ionicons name="document-outline" size={20} color="white" />
              <Text style={styles.exportButtonText}>Excel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.exportButton, styles.pdfButton]}
              onPress={() => handleExport('pdf')}
            >
              <Ionicons name="document-text-outline" size={20} color="white" />
              <Text style={styles.exportButtonText}>PDF</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Distribuciones mejoradas */}
        <View style={styles.distributionsSection}>
          <Text style={styles.sectionTitle}>📊 Distribuciones</Text>
          
          <View style={styles.distributionsContainer}>
            {/* Especialidades más populares */}
            <View style={styles.distributionCard}>
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
            </View>

            {/* Ubicaciones */}
            <View style={styles.distributionCard}>
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
                          { width: `${location.percentage}%`, backgroundColor: COLORS.success }
                        ]} 
                      />
                    </View>
                    <Text style={styles.distributionPercentage}>{location.percentage}%</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray[50],
  },
  headerGradient: {
    paddingTop: SPACING['5xl'],
    paddingBottom: SPACING['2xl'],
  },
  header: {
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
  scrollContainer: {
    flex: 1,
    marginTop: -SPACING['1xl'],
  },
  statsSection: {
    paddingHorizontal: CONTAINER_SPACING.screen,
    paddingTop: SPACING['4xl'],
    paddingBottom: SPACING['3xl'],
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.gray[800],
    marginBottom: SPACING['2xl'],
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.lg,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    padding: CONTAINER_SPACING.card,
    borderRadius: BORDER_RADIUS.xl,
    ...SHADOWS.md,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  statChange: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  statValue: {
    fontSize: FONT_SIZES['3xl'],
    fontWeight: FONT_WEIGHTS.extrabold,
    color: COLORS.gray[800],
    marginBottom: SPACING.xs,
  },
  statLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[600],
    fontWeight: FONT_WEIGHTS.semibold,
    textAlign: 'center',
  },
  cardTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.gray[800],
    marginBottom: SPACING.lg,
  },
  reportCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: CONTAINER_SPACING.card,
    marginHorizontal: CONTAINER_SPACING.screen,
    marginBottom: SPACING['2xl'],
    ...SHADOWS.md,
  },
  reportButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  reportButton: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.gray[50],
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.primary,
    alignItems: 'center',
  },
  reportButtonActive: {
    backgroundColor: COLORS.primary,
  },
  reportButtonIcon: {
    fontSize: 20,
    marginBottom: SPACING.xs,
  },
  reportButtonText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.primary,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  reportButtonTextActive: {
    color: COLORS.white,
  },
  exportCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: CONTAINER_SPACING.card,
    marginHorizontal: CONTAINER_SPACING.screen,
    marginBottom: SPACING['2xl'],
    ...SHADOWS.md,
  },
  exportHeader: {
    marginBottom: SPACING.lg,
  },
  exportSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[600],
    marginTop: SPACING.xs,
  },
  exportButtons: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  exportButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.sm,
  },
  excelButton: {
    backgroundColor: COLORS.success,
  },
  pdfButton: {
    backgroundColor: COLORS.danger,
  },
  exportButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.semibold,
    marginLeft: SPACING.sm,
  },
  distributionsSection: {
    paddingHorizontal: CONTAINER_SPACING.screen,
    paddingBottom: SPACING['6xl'],
  },
  distributionsContainer: {
    gap: SPACING.lg,
  },
  distributionCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: CONTAINER_SPACING.card,
    marginBottom: SPACING['2xl'],
    ...SHADOWS.md,
  },
  distributionTitle: {
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.gray[800],
    marginBottom: SPACING.lg,
  },
  distributionList: {
    gap: SPACING.lg,
  },
  distributionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  distributionInfo: {
    width: 100,
  },
  distributionName: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[800],
    fontWeight: FONT_WEIGHTS.semibold,
    marginBottom: 2,
  },
  distributionCount: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray[600],
  },
  distributionBar: {
    flex: 1,
    height: 6,
    backgroundColor: COLORS.gray[200],
    borderRadius: 3,
    overflow: 'hidden',
  },
  distributionBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  distributionPercentage: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray[800],
    fontWeight: FONT_WEIGHTS.semibold,
    width: 35,
    textAlign: 'right',
  },
});
