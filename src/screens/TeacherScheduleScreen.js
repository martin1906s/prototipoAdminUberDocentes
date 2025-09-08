import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import GradientBackground from '../components/GradientBackground';
import AppCard from '../components/AppCard';
import AppButton from '../components/AppButton';
import OptionsMenu from '../components/OptionsMenu';
import { MaterialIcons } from '@expo/vector-icons';
import { useStore } from '../store/store';
import { colors, typography, radii } from '../theme/theme';
import { SPACING } from '../utils/constants';

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const TIME_SLOTS = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
];

export default function TeacherScheduleScreen({ navigation }) {
  const { state, actions } = useStore();
  const [selectedDay, setSelectedDay] = useState(0);
  
  // Usar el horario guardado del estado o valores por defecto
  const defaultSchedule = {
    Lunes: ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'],
    Martes: ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'],
    Miércoles: ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'],
    Jueves: ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'],
    Viernes: ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'],
    Sábado: ['09:00', '10:00', '11:00'],
    Domingo: []
  };
  
  const [schedule, setSchedule] = useState(state.teacherSchedule || defaultSchedule);

  const toggleTimeSlot = (day, time) => {
    const daySchedule = schedule[day] || [];
    const isSelected = daySchedule.includes(time);
    
    setSchedule(prev => ({
      ...prev,
      [day]: isSelected 
        ? daySchedule.filter(t => t !== time)
        : [...daySchedule, time].sort()
    }));
  };

  const saveSchedule = () => {
    try {
      actions.updateTeacherSchedule(schedule);
      Alert.alert('Éxito', 'Horario actualizado correctamente', [
        {
          text: 'Continuar',
          onPress: () => {
            // Opcional: navegar de vuelta o mostrar confirmación
            // Horario guardado exitosamente
          }
        }
      ]);
    } catch (error) {
      // Error al guardar horario
      Alert.alert('Error', 'Hubo un problema al guardar el horario. Inténtalo de nuevo.');
    }
  };

  const clearDay = (day) => {
    Alert.alert(
      'Limpiar día',
      `¿Estás seguro de que quieres limpiar todos los horarios del ${day}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Limpiar', 
          style: 'destructive',
          onPress: () => setSchedule(prev => ({ ...prev, [day]: [] }))
        }
      ]
    );
  };

  const getDayStats = (day) => {
    const slots = schedule[day] || [];
    return {
      total: slots.length,
      hours: slots.length,
      percentage: Math.round((slots.length / TIME_SLOTS.length) * 100)
    };
  };

  return (
    <GradientBackground variant="white" theme="teacherSetup">
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.welcomeSection}>
              <View style={styles.welcomeIconContainer}>
                <Text style={styles.welcomeEmoji}>📅</Text>
              </View>
              <View style={styles.welcomeTextContainer}>
                <Text style={styles.welcomeText}>Mi Horario</Text>
                <Text style={styles.welcomeSubtext}>Gestiona tu disponibilidad</Text>
              </View>
            </View>
            <OptionsMenu navigation={navigation} theme="teacherSetup" />
          </View>
        </View>

        {/* Resumen semanal */}
        <AppCard style={styles.summaryCard}>
          <Text style={styles.cardTitle}>📊 Resumen Semanal</Text>
          <View style={styles.summaryGrid}>
            {DAYS.map((day, index) => {
              const stats = getDayStats(day);
              return (
                <View key={day} style={styles.summaryItem}>
                  <Text style={styles.summaryDay}>{day.slice(0, 3)}</Text>
                  <Text style={styles.summaryHours}>{stats.hours}h</Text>
                  <View style={styles.summaryBar}>
                    <View 
                      style={[
                        styles.summaryBarFill, 
                        { width: `${stats.percentage}%` }
                      ]} 
                    />
                  </View>
                </View>
              );
            })}
          </View>
        </AppCard>

        {/* Selector de días */}
        <AppCard style={styles.daySelectorCard}>
          <Text style={styles.cardTitle}>📅 Seleccionar Día</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dayScroll}>
            {DAYS.map((day, index) => {
              const stats = getDayStats(day);
              const isSelected = selectedDay === index;
              return (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.dayButton,
                    isSelected && styles.dayButtonSelected
                  ]}
                  onPress={() => setSelectedDay(index)}
                >
                  <Text style={[
                    styles.dayButtonText,
                    isSelected && styles.dayButtonTextSelected
                  ]}>
                    {day.slice(0, 3)}
                  </Text>
                  <Text style={[
                    styles.dayButtonHours,
                    isSelected && styles.dayButtonHoursSelected
                  ]}>
                    {stats.hours}h
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </AppCard>

        {/* Horarios del día seleccionado */}
        <AppCard style={styles.scheduleCard}>
          <View style={styles.scheduleHeader}>
            <Text style={styles.cardTitle}>
              ⏰ Horarios - {DAYS[selectedDay]}
            </Text>
            <TouchableOpacity 
              onPress={() => clearDay(DAYS[selectedDay])}
              style={styles.clearButton}
            >
              <MaterialIcons name="clear" size={16} color="#EF4444" />
              <Text style={styles.clearButtonText}>Limpiar día</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.timeSlotsGrid}>
            {TIME_SLOTS.map((time) => {
              const isSelected = (schedule[DAYS[selectedDay]] || []).includes(time);
              return (
                <TouchableOpacity
                  key={time}
                  style={[
                    styles.timeSlot,
                    isSelected && styles.timeSlotSelected
                  ]}
                  onPress={() => toggleTimeSlot(DAYS[selectedDay], time)}
                >
                  <Text style={[
                    styles.timeSlotText,
                    isSelected && styles.timeSlotTextSelected
                  ]}>
                    {time}
                  </Text>
                  {isSelected && (
                    <MaterialIcons name="check" size={16} color="white" />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </AppCard>

        {/* Botón de guardar */}
        <AppButton
          title="Guardar horario"
          leftIcon="save"
          onPress={saveSchedule}
          style={styles.saveButton}
        />
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: SPACING.xl,
    paddingBottom: 100,
  },
  header: {
    marginBottom: SPACING.lg,
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
    backgroundColor: colors.themes.teacherSetup.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
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
    color: '#581C87',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 2,
  },
  welcomeSubtext: {
    ...typography.bodySmall,
    color: '#6B7280',
    fontSize: 14,
  },
  summaryCard: {
    marginBottom: SPACING.lg,
  },
  cardTitle: {
    ...typography.subtitle,
    color: '#581C87',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: SPACING.lg,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryDay: {
    ...typography.caption,
    color: '#6B7280',
    fontSize: 12,
    marginBottom: SPACING.xs,
  },
  summaryHours: {
    ...typography.bodySmall,
    color: '#581C87',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  summaryBar: {
    width: 20,
    height: 4,
    backgroundColor: colors.themes.teacherSetup.card,
    borderRadius: 2,
    overflow: 'hidden',
  },
  summaryBarFill: {
    height: '100%',
    backgroundColor: colors.themes.teacherSetup.primary,
  },
  daySelectorCard: {
    marginBottom: SPACING.lg,
  },
  dayScroll: {
    marginTop: SPACING.md,
  },
  dayButton: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    marginRight: SPACING.sm,
    backgroundColor: colors.themes.teacherSetup.card,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 60,
  },
  dayButtonSelected: {
    backgroundColor: colors.themes.teacherSetup.primary,
  },
  dayButtonText: {
    ...typography.bodySmall,
    color: '#581C87',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  dayButtonTextSelected: {
    color: 'white',
  },
  dayButtonHours: {
    ...typography.caption,
    color: '#6B7280',
    fontSize: 10,
  },
  dayButtonHoursSelected: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  scheduleCard: {
    marginBottom: SPACING.lg,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: colors.themes.teacherSetup.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  clearButtonText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: SPACING.xs,
  },
  timeSlotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  timeSlot: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: colors.themes.teacherSetup.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.themes.teacherSetup.primary,
    alignItems: 'center',
    minWidth: 60,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  timeSlotSelected: {
    backgroundColor: colors.themes.teacherSetup.primary,
  },
  timeSlotText: {
    ...typography.bodySmall,
    color: '#8B5CF6',
    fontSize: 12,
    fontWeight: '600',
  },
  timeSlotTextSelected: {
    color: 'white',
    marginRight: SPACING.xs,
  },
  saveButton: {
    marginTop: SPACING.lg,
  },
});
