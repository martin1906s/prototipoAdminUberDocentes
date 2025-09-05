import React from 'react';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import WebCompatibleLinearGradient from './WebCompatibleLinearGradient';
import { COLORS } from '../utils/constants';

// Importar SVG solo en plataformas nativas
let Svg, Circle, Rect, Line, SvgText, G;
if (Platform.OS !== 'web') {
  const SvgComponents = require('react-native-svg');
  Svg = SvgComponents.default;
  Circle = SvgComponents.Circle;
  Rect = SvgComponents.Rect;
  Line = SvgComponents.Line;
  SvgText = SvgComponents.Text;
  G = SvgComponents.G;
}

const { width: screenWidth } = Dimensions.get('window');

// Componente base para gráficas
export default function NativeChart({ children, title, height = 200 }) {
  return (
    <View style={[styles.chartContainer, { height }]}>
      {title && <Text style={styles.chartTitle}>{title}</Text>}
      <View style={styles.chartContent}>
        {children}
      </View>
    </View>
  );
}

// Gráfico de barras nativo
export function NativeBarChart({ data, labels, colors: chartColors, height = 200 }) {
  const maxValue = Math.max(...data);
  const chartWidth = screenWidth - 80;
  const barWidth = (chartWidth - (data.length - 1) * 10) / data.length;
  
  return (
    <NativeChart title="Actividad de Propuestas - Últimos 7 días" height={height}>
      <View style={styles.barChartContainer}>
        <View style={styles.barChart}>
          {data.map((value, index) => {
            const barHeight = (value / maxValue) * (height - 80);
            return (
              <View key={index} style={styles.barContainer}>
                <View style={styles.barWrapper}>
                  <WebCompatibleLinearGradient
                    colors={[chartColors[index] + '80', chartColors[index] + '40']}
                    style={[
                      styles.bar,
                      {
                        width: barWidth,
                        height: barHeight,
                        backgroundColor: chartColors[index] + '80',
                      }
                    ]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                  />
                </View>
                <Text style={styles.barLabel}>{labels[index]}</Text>
                <Text style={styles.barValue}>{value}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </NativeChart>
  );
}

// Gráfico de dona nativo
export function NativeDoughnutChart({ data, labels, colors: chartColors, height = 200 }) {
  const total = data.reduce((sum, value) => sum + value, 0);
  const radius = 50; // Reducido para evitar desbordamiento
  const strokeWidth = 16; // Reducido proporcionalmente
  const circumference = 2 * Math.PI * radius;
  
  let currentAngle = 0;
  
  return (
    <NativeChart title="Distribución de Propuestas" height={height}>
      <View style={styles.doughnutContainer}>
        <View style={styles.doughnutChart}>
          {Platform.OS !== 'web' && Svg ? (
            <Svg width={120} height={120}>
              {data.map((value, index) => {
                const percentage = value / total;
                const strokeDasharray = `${percentage * circumference} ${circumference}`;
                const rotation = currentAngle;
                currentAngle += percentage * 360;
                
                return (
                  <Circle
                    key={index}
                    cx={60}
                    cy={60}
                    r={radius}
                    stroke={chartColors[index]}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={0}
                    transform={`rotate(${rotation} 60 60)`}
                    strokeLinecap="round"
                  />
                );
              })}
            </Svg>
          ) : (
            // Fallback para web - mostrar solo el total
            <View style={styles.webFallback}>
              <Text style={styles.webFallbackText}>Gráfico no disponible en web</Text>
            </View>
          )}
          <View style={styles.doughnutCenter}>
            <Text style={styles.doughnutTotal}>{total}</Text>
            <Text style={styles.doughnutLabel}>Total</Text>
          </View>
        </View>
        
        <View style={styles.doughnutLegend}>
          {data.map((value, index) => (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: chartColors[index] }]} />
              <Text style={styles.legendText}>{labels[index]}: {value}</Text>
            </View>
          ))}
        </View>
      </View>
    </NativeChart>
  );
}

// Gráfico de líneas nativo
export function NativeLineChart({ data, labels, colors: chartColors, height = 200 }) {
  const maxValue = Math.max(...data.map(dataset => Math.max(...dataset.data)));
  const chartWidth = screenWidth - 80;
  const chartHeight = height - 100;
  const pointSpacing = chartWidth / (data[0].data.length - 1);
  
  const createPath = (dataset) => {
    let path = '';
    dataset.data.forEach((value, index) => {
      const x = index * pointSpacing;
      const y = chartHeight - (value / maxValue) * chartHeight;
      if (index === 0) {
        path += `M ${x} ${y}`;
      } else {
        path += ` L ${x} ${y}`;
      }
    });
    return path;
  };
  
  return (
    <NativeChart title="Crecimiento de Usuarios y Docentes" height={height}>
      <View style={styles.lineChartContainer}>
        {Platform.OS !== 'web' && Svg ? (
          <Svg width={chartWidth} height={chartHeight}>
            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
              <Line
                key={index}
                x1={0}
                y1={ratio * chartHeight}
                x2={chartWidth}
                y2={ratio * chartHeight}
                stroke="#E5E7EB"
                strokeWidth={1}
              />
            ))}
            
            {/* Data lines */}
            {data.map((dataset, datasetIndex) => (
              <G key={datasetIndex}>
                <Line
                  d={createPath(dataset)}
                  stroke={chartColors[datasetIndex]}
                  strokeWidth={3}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {dataset.data.map((value, pointIndex) => {
                  const x = pointIndex * pointSpacing;
                  const y = chartHeight - (value / maxValue) * chartHeight;
                  return (
                    <Circle
                      key={pointIndex}
                      cx={x}
                      cy={y}
                      r={4}
                      fill={chartColors[datasetIndex]}
                      stroke="white"
                      strokeWidth={2}
                    />
                  );
                })}
              </G>
            ))}
          </Svg>
        ) : (
          // Fallback para web
          <View style={styles.webFallback}>
            <Text style={styles.webFallbackText}>Gráfico no disponible en web</Text>
          </View>
        )}
        
        <View style={styles.lineChartLabels}>
          {labels.map((label, index) => (
            <Text key={index} style={styles.lineChartLabel}>{label}</Text>
          ))}
        </View>
        
        <View style={styles.lineChartLegend}>
          {data.map((dataset, index) => (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: chartColors[index] }]} />
              <Text style={styles.legendText}>{dataset.label}</Text>
            </View>
          ))}
        </View>
      </View>
    </NativeChart>
  );
}

// Componentes específicos para el dashboard
export function ProposalsBarChart({ metrics }) {
  const data = [
    metrics.propuestasAceptadas * 2,
    metrics.propuestasAceptadas * 1.5,
    metrics.propuestasAceptadas * 2.2,
    metrics.propuestasAceptadas * 1.8,
    metrics.propuestasAceptadas * 2.5,
    metrics.propuestasAceptadas * 1.2,
    metrics.propuestasAceptadas * 1.9,
  ];
  
  const labels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const chartColors = [
    COLORS.success,
    COLORS.warning,
    COLORS.danger,
    COLORS.info,
    COLORS.secondary,
    COLORS.primary,
    COLORS.accent,
  ];
  
  return <NativeBarChart data={data} labels={labels} colors={chartColors} height={300} />;
}

export function ProposalsDoughnutChart({ metrics }) {
  const data = [
    metrics.propuestasAceptadas,
    metrics.propuestasPendientes,
    metrics.propuestasRechazadas,
  ];
  
  const labels = ['Aceptadas', 'Pendientes', 'Rechazadas'];
  const chartColors = [COLORS.success, COLORS.warning, COLORS.danger];
  
  return <NativeDoughnutChart data={data} labels={labels} colors={chartColors} height={250} />;
}

export function UsersGrowthLineChart({ metrics }) {
  const data = [
    {
      label: 'Usuarios Registrados',
      data: [12, 19, 25, 32, 28, metrics.usuariosRegistrados],
    },
    {
      label: 'Docentes Activos',
      data: [8, 12, 18, 22, 20, metrics.docentesRegistrados],
    },
  ];
  
  const labels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
  const chartColors = [COLORS.info, COLORS.warning];
  
  return <NativeLineChart data={data} labels={labels} colors={chartColors} height={300} />;
}

const styles = StyleSheet.create({
  chartContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  chartContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Bar Chart Styles
  barChartContainer: {
    width: '100%',
    alignItems: 'center',
  },
  barChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 200,
    width: '100%',
    paddingHorizontal: 10,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  barWrapper: {
    justifyContent: 'flex-end',
    height: 160,
    marginBottom: 8,
  },
  bar: {
    borderRadius: 4,
    minHeight: 4,
  },
  barLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 2,
  },
  barValue: {
    fontSize: 9,
    fontWeight: '600',
    color: '#1F2937',
  },
  
  // Doughnut Chart Styles
  doughnutContainer: {
    alignItems: 'center',
    width: '100%',
  },
  doughnutChart: {
    position: 'relative',
    marginBottom: 16,
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  doughnutCenter: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  doughnutTotal: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1F2937',
  },
  doughnutLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#6B7280',
  },
  doughnutLegend: {
    alignItems: 'center',
    width: '100%',
  },
  
  // Line Chart Styles
  lineChartContainer: {
    width: '100%',
    alignItems: 'center',
  },
  lineChartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 8,
    paddingHorizontal: 10,
  },
  lineChartLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#6B7280',
  },
  lineChartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    gap: 16,
  },
  
  // Common Legend Styles
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  
  // Web fallback styles
  webFallback: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 60,
  },
  webFallbackText: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
  },
});
