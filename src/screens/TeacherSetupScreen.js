import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, Animated, Dimensions, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import GradientBackground from '../components/GradientBackground';
import AppInput from '../components/AppInput';
import AppButton from '../components/AppButton';
import AppCard from '../components/AppCard';
import LocationSelector from '../components/LocationSelector';
import WebCompatibleLinearGradient from '../components/WebCompatibleLinearGradient';
import { MaterialIcons } from '@expo/vector-icons';
import { ChipGroup } from '../components/Chips';
import StepIndicator from '../components/StepIndicator';
import { useStore } from '../store/store';
import { radii, colors, typography, elevation, animations } from '../theme/theme';
import { SPACING } from '../utils/constants';

const { width } = Dimensions.get('window');

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const TIME_SLOTS = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
];

export default function TeacherSetupScreen({ navigation }) {
  const { state, actions } = useStore();
  const [nombre, setNombre] = useState(state.teacherProfile?.nombre || '');
  const [email, setEmail] = useState(state.teacherProfile?.email || '');
  const [telefono, setTelefono] = useState(state.teacherProfile?.telefono || '');
  const [especialidades, setEspecialidades] = useState(state.teacherProfile?.especialidades || []);
  const [especialidadInput, setEspecialidadInput] = useState('');
  const [experiencia, setExperiencia] = useState(state.teacherProfile?.experiencia || '0-2 años');
  const [descripcion, setDescripcion] = useState(state.teacherProfile?.descripcion || '');
  const [ubicacion, setUbicacion] = useState(state.teacherProfile?.ubicacion || '');
  const [provincia, setProvincia] = useState(state.teacherProfile?.provincia || '');
  const [ciudad, setCiudad] = useState(state.teacherProfile?.ciudad || '');
  const [tipoInstitucion, setTipoInstitucion] = useState(state.teacherProfile?.tipoInstitucion || '');
  const [precioHora, setPrecioHora] = useState(state.teacherProfile?.precioHora || '');
  const [disponibilidad, setDisponibilidad] = useState(state.teacherProfile?.disponibilidad || '');
  const [selectedDay, setSelectedDay] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [schedule, setSchedule] = useState(state.teacherSchedule || {
    Lunes: ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'],
    Martes: ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'],
    Miércoles: ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'],
    Jueves: ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'],
    Viernes: ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'],
    Sábado: ['09:00', '10:00', '11:00'],
    Domingo: []
  });
  
  const [errors, setErrors] = useState({});
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scrollViewRef = useRef(null);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: animations.normal,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: animations.normal,
        useNativeDriver: Platform.OS !== 'web',
      }),
    ]).start();
  }, []);

  // Inicializar provincia y ciudad desde ubicación existente
  useEffect(() => {
    if (ubicacion && !provincia && !ciudad) {
      const locationParts = ubicacion.split(', ');
      if (locationParts.length >= 2) {
        setCiudad(locationParts[0].trim());
        setProvincia(locationParts[1].trim());
      } else {
        setCiudad(locationParts[0].trim());
      }
    }
  }, [ubicacion, provincia, ciudad]);

  const validateField = (field, value) => {
    const newErrors = { ...errors };
    
    switch (field) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value && !emailRegex.test(value)) {
          newErrors.email = 'Formato de email inválido';
        } else {
          delete newErrors.email;
        }
        break;
      case 'telefono':
        if (value && value.length < 10) {
          newErrors.telefono = 'Teléfono debe tener al menos 10 dígitos';
        } else {
          delete newErrors.telefono;
        }
        break;
      case 'nombre':
        if (value && value.length < 2) {
          newErrors.nombre = 'Nombre debe tener al menos 2 caracteres';
        } else {
          delete newErrors.nombre;
        }
        break;
      case 'precioHora':
        if (value && (isNaN(value) || parseFloat(value) < 0)) {
          newErrors.precioHora = 'Precio debe ser un número válido';
        } else {
          delete newErrors.precioHora;
        }
        break;
    }
    
    setErrors(newErrors);
  };

  const handleGuardar = () => {
    try {
      const newErrors = {};
      
      if (!nombre) newErrors.nombre = 'Nombre es obligatorio';
      if (!email) newErrors.email = 'Email es obligatorio';
      if (!telefono) newErrors.telefono = 'Teléfono es obligatorio';
      
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        Alert.alert('Campos obligatorios', 'Completa todos los campos requeridos.');
        return;
      }
      
      const perfil = {
        nombre,
        email,
        telefono,
        especialidades,
        experiencia,
        descripcion,
        ubicacion,
        provincia,
        ciudad,
        tipoInstitucion,
        precioHora,
        disponibilidad,
      };
      
      actions.saveTeacherProfile(perfil);
      actions.updateTeacherSchedule(schedule);
      
      const tempTeacher = {
        id: `temp_${Date.now()}`,
        ...perfil,
        isPaid: false,
      };
      actions.setCurrentTeacher(tempTeacher);
      
      setShowPaymentModal(true);
      
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al guardar el perfil. Inténtalo de nuevo.');
    }
  };

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

  const clearDay = (day) => {
    setSchedule(prev => ({ ...prev, [day]: [] }));
  };

  const getDayStats = (day) => {
    const slots = schedule[day] || [];
    return {
      total: slots.length,
      hours: slots.length,
      percentage: Math.round((slots.length / TIME_SLOTS.length) * 100)
    };
  };

  const handlePayment = () => {
    if (isProcessingPayment) return;
    
    setIsProcessingPayment(true);
    
    if (Platform.OS === 'web') {
      const confirmed = window.confirm('¿Confirmar el pago de $26.50 USD?');
      if (confirmed) {
        setShowPaymentModal(false);
        actions.setCurrentTeacher({
          ...state.currentTeacher,
          isPaid: true
        });
        navigation.reset({
          index: 0,
          routes: [{ name: 'TeacherTabs' }],
        });
      } else {
        setIsProcessingPayment(false);
      }
    } else {
      Alert.alert(
        'Pago Exitoso',
        'Tu registro ha sido completado exitosamente. Ahora puedes recibir propuestas de estudiantes.',
        [
          {
            text: 'Continuar',
            onPress: () => {
              setShowPaymentModal(false);
              actions.setCurrentTeacher({
                ...state.currentTeacher,
                isPaid: true
              });
              navigation.reset({
                index: 0,
                routes: [{ name: 'TeacherTabs' }],
              });
            }
          },
          {
            text: 'Cancelar',
            onPress: () => {
              setIsProcessingPayment(false);
            }
          }
        ]
      );
    }
  };

  const handleLocationSelect = (selectedProvincia, selectedCiudad) => {
    setProvincia(selectedProvincia);
    setCiudad(selectedCiudad);
    setUbicacion(`${selectedCiudad}, ${selectedProvincia}`);
  };

  const handleAutocompletar = () => {
    setNombre('Juan Torres');
    setEmail('juan.torres@example.com');
    setTelefono('+593 99 988 8777');
    setEspecialidades(['Matemática', 'Física']);
    setExperiencia('3-5 años');
    setDescripcion('Docente con amplia experiencia en matemáticas y física. Especializado en preparación para exámenes universitarios y apoyo escolar.');
    setProvincia('Pichincha');
    setCiudad('Quito');
    setUbicacion('Quito, Pichincha');
    setTipoInstitucion('colegio');
    setPrecioHora('25');
    setDisponibilidad('Mañana y tarde');
    setEspecialidadInput('');
  };

  return (
    <GradientBackground variant="white" theme="teacherSetup">
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          ref={scrollViewRef}
          contentContainerStyle={styles.container} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <Animated.View 
            style={[
              styles.header,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <WebCompatibleLinearGradient
              colors={['#FF4757', '#FF6B6B', '#FF9800']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.headerGradient}
            >
              <View style={styles.titleSection}>
                <View style={styles.titleContainer}>
                  <View style={styles.logoContainer}>
                    <View style={styles.logoBackground}>
                      <Text style={styles.logoEmoji}>👨‍🏫</Text>
                    </View>
                    <View style={styles.logoAccent}>
                      <MaterialIcons name="star" size={16} color="white" />
                    </View>
                  </View>
                  <View style={styles.titleTextContainer}>
                    <Text style={styles.title}>Perfil Docente</Text>
                    <Text style={styles.subtitle}>
                      Completa tu información para comenzar a enseñar
                    </Text>
                  </View>
                </View>
                <AppButton
                  iconOnly
                  leftIcon="swap-horiz"
                  onPress={() => navigation.reset({ index: 0, routes: [{ name: 'RoleSelect' }] })}
                  variant="ghost"
                  size="md"
                  style={styles.roleButton}
                />
              </View>
            </WebCompatibleLinearGradient>
          </Animated.View>

          {/* Información Personal */}
          <View style={styles.formSection}>
            <WebCompatibleLinearGradient
              colors={['#2ED573', '#4ECDC4']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.sectionHeader}
            >
              <Text style={styles.sectionTitle}>👤 Información Personal</Text>
            </WebCompatibleLinearGradient>
            
            <AppInput 
              label="Nombre completo"
              placeholder="Tu nombre completo"
              value={nombre} 
              onChangeText={(text) => {
                setNombre(text);
                validateField('nombre', text);
              }}
              leftIcon="person"
              error={errors.nombre}
              style={styles.input}
            />
            
            <AppInput 
              label="Email"
              placeholder="tu@email.com"
              value={email} 
              onChangeText={(text) => {
                setEmail(text);
                validateField('email', text);
              }}
              keyboardType="email-address"
              leftIcon="email"
              error={errors.email}
              style={styles.input}
            />
            
            <AppInput 
              label="Teléfono"
              placeholder="+593 99 999 9999"
              value={telefono} 
              onChangeText={(text) => {
                setTelefono(text);
                validateField('telefono', text);
              }}
              keyboardType="phone-pad"
              leftIcon="phone"
              error={errors.telefono}
              style={styles.input}
            />
            
            <Text style={styles.fieldLabel}>Ubicación</Text>
            <LocationSelector
              selectedProvince={provincia}
              selectedCity={ciudad}
              onLocationSelect={handleLocationSelect}
              style={styles.locationSelector}
            />
            
            <Text style={styles.fieldLabel}>Nivel de Enseñanza</Text>
            <ChipGroup
              options={["Escuela", "Colegio", "Universidad"]}
              value={tipoInstitucion}
              onChange={setTipoInstitucion}
              style={styles.chips}
            />
          </View>

          {/* Especialidades */}
          <View style={styles.formSection}>
            <WebCompatibleLinearGradient
              colors={['#FF9800', '#FFA726']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.sectionHeader}
            >
              <Text style={styles.sectionTitle}>📚 Especialidades</Text>
            </WebCompatibleLinearGradient>
            
            <View style={styles.addSpecialtyContainer}>
              <AppInput
                placeholder="Agregar especialidad..."
                value={especialidadInput}
                onChangeText={setEspecialidadInput}
                leftIcon="add"
                style={styles.specialtyInput}
                onSubmitEditing={() => {
                  const val = (especialidadInput || '').trim();
                  if (!val) return;
                  const exists = especialidades.some((e) => e.toLowerCase() === val.toLowerCase());
                  if (exists) {
                    setEspecialidadInput('');
                    return;
                  }
                  setEspecialidades([...especialidades, val]);
                  setEspecialidadInput('');
                }}
              />
              <AppButton
                iconOnly
                leftIcon="add"
                onPress={() => {
                  const val = (especialidadInput || '').trim();
                  if (!val) return;
                  const exists = especialidades.some((e) => e.toLowerCase() === val.toLowerCase());
                  if (exists) {
                    setEspecialidadInput('');
                    return;
                  }
                  setEspecialidades([...especialidades, val]);
                  setEspecialidadInput('');
                }}
                variant="primary"
                size="sm"
                style={styles.addButton}
              />
            </View>
            
            <View style={styles.specialtiesList}>
              {especialidades.map((esp, index) => (
                <View key={`specialty-${esp}-${index}`} style={styles.specialtyItem}>
                  <Text style={styles.specialtyText}>{esp}</Text>
                  <TouchableOpacity 
                    onPress={() => setEspecialidades(especialidades.filter((e) => e !== esp))}
                    style={styles.removeButton}
                  >
                    <MaterialIcons name="close" size={20} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>

          {/* Experiencia */}
          <View style={styles.formSection}>
            <WebCompatibleLinearGradient
              colors={['#667eea', '#764ba2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.sectionHeader}
            >
              <Text style={styles.sectionTitle}>💼 Experiencia</Text>
            </WebCompatibleLinearGradient>
            
            <Text style={styles.fieldLabel}>Años de experiencia</Text>
            <ChipGroup
              options={["0-2 años", "3-5 años", "6-9 años", "10+ años"]}
              value={experiencia}
              onChange={setExperiencia}
              style={styles.chips}
            />
          </View>

          {/* Horarios de Trabajo */}
          <View style={styles.formSection}>
            <WebCompatibleLinearGradient
              colors={['#00D2FF', '#3A7BD5']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.sectionHeader}
            >
              <Text style={styles.sectionTitle}>📅 Horarios de Trabajo</Text>
            </WebCompatibleLinearGradient>
            
            {/* Resumen semanal */}
            <View style={styles.scheduleSummary}>
              <Text style={styles.scheduleSummaryTitle}>Resumen Semanal</Text>
              <View style={styles.scheduleSummaryGrid}>
                {DAYS.map((day, index) => {
                  const stats = getDayStats(day);
                  return (
                    <View key={day} style={styles.scheduleSummaryItem}>
                      <Text style={styles.scheduleSummaryDay}>{day.slice(0, 3)}</Text>
                      <Text style={styles.scheduleSummaryHours}>{stats.hours}h</Text>
                      <View style={styles.scheduleSummaryBar}>
                        <View 
                          style={[
                            styles.scheduleSummaryBarFill, 
                            { width: `${stats.percentage}%` }
                          ]} 
                        />
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Selector de días */}
            <View style={styles.daySelector}>
              <Text style={styles.daySelectorTitle}>Seleccionar Día</Text>
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
            </View>

            {/* Horarios del día seleccionado */}
            <View style={styles.timeSlotsSection}>
              <View style={styles.timeSlotsHeader}>
                <Text style={styles.timeSlotsTitle}>
                  Horarios - {DAYS[selectedDay]}
                </Text>
                <TouchableOpacity 
                  onPress={() => clearDay(DAYS[selectedDay])}
                  style={styles.clearDayButton}
                >
                  <MaterialIcons name="clear" size={20} color="#EF4444" />
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
            </View>
          </View>

          {/* Descripción */}
          <View style={styles.formSection}>
            <WebCompatibleLinearGradient
              colors={['#FF416C', '#FF4B6B']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.sectionHeader}
            >
              <Text style={styles.sectionTitle}>📝 Descripción</Text>
            </WebCompatibleLinearGradient>
            
            <AppInput 
              label="Cuéntanos sobre tu experiencia"
              placeholder="Describe tu experiencia y metodología de enseñanza..."
              value={descripcion} 
              onChangeText={setDescripcion}
              multiline
              numberOfLines={4}
              leftIcon="description"
              style={styles.input}
            />
          </View>

          {/* Precio */}
          <View style={styles.formSection}>
            <WebCompatibleLinearGradient
              colors={['#059669', '#10B981']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.sectionHeader}
            >
              <Text style={styles.sectionTitle}>💰 Tarifa</Text>
            </WebCompatibleLinearGradient>
            
            <AppInput 
              label="Precio por hora (USD)"
              placeholder="25"
              value={precioHora} 
              onChangeText={(text) => {
                setPrecioHora(text);
                validateField('precioHora', text);
              }}
              keyboardType="numeric"
              leftIcon="attach-money"
              style={styles.input}
              error={errors.precioHora}
            />
            
            <Text style={styles.priceHint}>
              Precio sugerido: $15-50 USD/hora
            </Text>
          </View>

          {/* Botones */}
          <View style={styles.buttonsContainer}>
            <AppButton
              title="Ver Demo"
              leftIcon="visibility"
              onPress={handleAutocompletar}
              variant="warning"
              size="lg"
              style={styles.demoButton}
            />
            
            <AppButton
              title="Guardar Perfil"
              leftIcon="save"
              onPress={handleGuardar}
              variant="success"
              size="lg"
              disabled={Object.keys(errors).length > 0}
              style={styles.saveButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal de Pago */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showPaymentModal}
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>💳 Completar Registro</Text>
              <TouchableOpacity 
                onPress={() => {
                  setShowPaymentModal(false);
                  setIsProcessingPayment(false);
                }}
                style={styles.closeButton}
              >
                <MaterialIcons name="close" size={24} color={colors.neutral600} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalContent}>
              <View style={styles.paymentInfo}>
                <View style={styles.paymentIcon}>
                  <MaterialIcons name="account-balance-wallet" size={48} color={colors.primary} />
                </View>
                
                <Text style={styles.paymentTitle}>Registro de Docente</Text>
                
                <View style={styles.paymentDetails}>
                  <View style={styles.paymentRow}>
                    <Text style={styles.paymentLabel}>Comisión de registro:</Text>
                    <Text style={styles.paymentAmount}>$25.00 USD</Text>
                  </View>
                  <View style={styles.paymentRow}>
                    <Text style={styles.paymentLabel}>Procesamiento:</Text>
                    <Text style={styles.paymentAmount}>$1.50 USD</Text>
                  </View>
                  <View style={styles.paymentDivider} />
                  <View style={styles.paymentRow}>
                    <Text style={styles.paymentTotalLabel}>Total:</Text>
                    <Text style={styles.paymentTotalAmount}>$26.50 USD</Text>
                  </View>
                </View>

                <Text style={styles.paymentNote}>
                  Una vez completado el pago, tu perfil estará activo y podrás recibir propuestas de estudiantes.
                </Text>
              </View>
            </View>

            <View style={styles.modalActions}>
              <AppButton
                title="Cancelar"
                leftIcon="close"
                onPress={() => {
                  setShowPaymentModal(false);
                  setIsProcessingPayment(false);
                }}
                variant="outline"
                size="md"
                style={[styles.modalButton, styles.cancelButton]}
              />
              
              <AppButton
                title={isProcessingPayment ? "Procesando..." : "Pagar $26.50"}
                leftIcon="attach-money"
                onPress={handlePayment}
                variant="success"
                size="md"
                disabled={isProcessingPayment}
                loading={isProcessingPayment}
                style={[styles.modalButton, styles.payButton]}
              />
            </View>
          </View>
        </View>
      </Modal>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: SPACING.lg,
    paddingBottom: SPACING['3xl'],
  },
  header: {
    marginBottom: SPACING.xl,
    borderRadius: radii.xl,
    overflow: 'hidden',
    ...elevation.lg,
  },
  headerGradient: {
    padding: SPACING.xl,
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    position: 'relative',
    marginRight: SPACING.lg,
  },
  logoBackground: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    ...elevation.md,
  },
  logoEmoji: {
    fontSize: 28,
  },
  logoAccent: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    ...elevation.sm,
  },
  titleTextContainer: {
    flex: 1,
  },
  title: {
    ...typography.title,
    color: 'white',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: SPACING.xs,
  },
  subtitle: {
    ...typography.bodySmall,
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    lineHeight: 20,
  },
  roleButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: SPACING.md,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 48,
    minHeight: 48,
    ...elevation.sm,
  },
  formSection: {
    marginBottom: SPACING.xl,
    backgroundColor: colors.themes.teacherSetup.card,
    borderRadius: radii.xl,
    overflow: 'hidden',
    ...elevation.lg,
  },
  sectionHeader: {
    padding: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  sectionTitle: {
    ...typography.subtitle,
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
    textAlign: 'center',
  },
  input: {
    marginBottom: SPACING.md,
    marginHorizontal: SPACING.lg,
  },
  fieldLabel: {
    ...typography.bodySmall,
    color: colors.themes.teacherSetup.text,
    fontWeight: '600',
    fontSize: 13,
    marginBottom: SPACING.sm,
    marginHorizontal: SPACING.lg,
  },
  chips: {
    marginTop: SPACING.sm,
    marginHorizontal: SPACING.lg,
  },
  locationSelector: {
    marginTop: SPACING.sm,
    marginHorizontal: SPACING.lg,
  },
  priceHint: {
    ...typography.caption,
    color: colors.themes.teacherSetup.textSecondary,
    fontSize: 12,
    marginTop: SPACING.xs,
    fontStyle: 'italic',
    marginHorizontal: SPACING.lg,
  },
  addSpecialtyContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
    marginHorizontal: SPACING.lg,
  },
  specialtyInput: {
    flex: 1,
  },
  addButton: {
    backgroundColor: colors.themes.teacherSetup.primary,
    padding: SPACING.md,
    borderRadius: radii.lg,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    ...elevation.md,
  },
  specialtiesList: {
    gap: SPACING.sm,
    marginHorizontal: SPACING.lg,
  },
  specialtyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.themes.teacherSetup.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.themes.teacherSetup.border,
    ...elevation.sm,
  },
  specialtyText: {
    color: colors.themes.teacherSetup.text,
    fontWeight: '500',
    fontSize: 13,
  },
  removeButton: {
    padding: SPACING.sm,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 32,
    minHeight: 32,
  },
  buttonsContainer: {
    marginTop: SPACING.xl,
    gap: SPACING.md,
  },
  demoButton: {
    borderRadius: radii.xl,
    overflow: 'hidden',
    ...elevation.lg,
  },
  saveButton: {
    borderRadius: radii.xl,
    overflow: 'hidden',
    ...elevation.lg,
  },
  scheduleSummary: {
    marginBottom: SPACING.lg,
    marginHorizontal: SPACING.lg,
  },
  scheduleSummaryTitle: {
    ...typography.bodySmall,
    color: colors.themes.teacherSetup.text,
    fontWeight: '600',
    fontSize: 13,
    marginBottom: SPACING.md,
  },
  scheduleSummaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scheduleSummaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  scheduleSummaryDay: {
    ...typography.caption,
    color: colors.themes.teacherSetup.textSecondary,
    fontSize: 12,
    marginBottom: SPACING.xs,
  },
  scheduleSummaryHours: {
    ...typography.bodySmall,
    color: colors.themes.teacherSetup.primary,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  scheduleSummaryBar: {
    width: 20,
    height: 4,
    backgroundColor: colors.themes.teacherSetup.surface,
    borderRadius: 2,
    overflow: 'hidden',
  },
  scheduleSummaryBarFill: {
    height: '100%',
    backgroundColor: colors.themes.teacherSetup.primary,
  },
  daySelector: {
    marginBottom: SPACING.lg,
    marginHorizontal: SPACING.lg,
  },
  daySelectorTitle: {
    ...typography.bodySmall,
    color: colors.themes.teacherSetup.text,
    fontWeight: '600',
    fontSize: 13,
    marginBottom: SPACING.md,
  },
  dayScroll: {
    marginTop: SPACING.md,
  },
  dayButton: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    marginRight: SPACING.sm,
    backgroundColor: colors.themes.teacherSetup.surface,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 60,
    ...elevation.sm,
  },
  dayButtonSelected: {
    backgroundColor: colors.themes.teacherSetup.primary,
  },
  dayButtonText: {
    ...typography.bodySmall,
    color: colors.themes.teacherSetup.text,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  dayButtonTextSelected: {
    color: 'white',
  },
  dayButtonHours: {
    ...typography.caption,
    color: colors.themes.teacherSetup.textSecondary,
    fontSize: 10,
  },
  dayButtonHoursSelected: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  timeSlotsSection: {
    marginBottom: SPACING.lg,
    marginHorizontal: SPACING.lg,
  },
  timeSlotsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  timeSlotsTitle: {
    ...typography.bodySmall,
    color: colors.themes.teacherSetup.text,
    fontWeight: '600',
    fontSize: 13,
  },
  clearDayButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: colors.themes.teacherSetup.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EF4444',
    minWidth: 40,
    minHeight: 40,
    ...elevation.sm,
  },
  timeSlotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  timeSlot: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: colors.themes.teacherSetup.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.themes.teacherSetup.border,
    alignItems: 'center',
    minWidth: 60,
    flexDirection: 'row',
    justifyContent: 'center',
    ...elevation.xs,
  },
  timeSlotSelected: {
    backgroundColor: colors.themes.teacherSetup.primary,
    borderColor: colors.themes.teacherSetup.primary,
  },
  timeSlotText: {
    ...typography.bodySmall,
    color: colors.themes.teacherSetup.text,
    fontSize: 11,
    fontWeight: '600',
  },
  timeSlotTextSelected: {
    color: 'white',
    marginRight: SPACING.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    width: '90%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.themes.teacherSetup.textSecondary + '20',
  },
  modalTitle: {
    ...typography.h3,
    color: colors.neutral900,
    fontWeight: '700',
  },
  closeButton: {
    padding: SPACING.sm,
  },
  modalContent: {
    maxHeight: 400,
    paddingHorizontal: SPACING.lg,
  },
  paymentInfo: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  paymentIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  paymentTitle: {
    ...typography.h3,
    color: colors.neutral900,
    fontWeight: '700',
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  paymentDetails: {
    width: '100%',
    backgroundColor: colors.neutral50,
    borderRadius: radii.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: colors.neutral200,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  paymentLabel: {
    ...typography.body,
    color: colors.neutral600,
  },
  paymentAmount: {
    ...typography.body,
    color: colors.neutral900,
    fontWeight: '600',
  },
  paymentDivider: {
    height: 1,
    backgroundColor: colors.neutral300,
    marginVertical: SPACING.sm,
  },
  paymentTotalLabel: {
    ...typography.h4,
    color: colors.neutral900,
    fontWeight: '700',
  },
  paymentTotalAmount: {
    ...typography.h4,
    color: colors.primary,
    fontWeight: '700',
  },
  paymentNote: {
    ...typography.caption,
    color: colors.neutral600,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  modalActions: {
    flexDirection: 'row',
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: colors.neutral200,
    gap: SPACING.md,
  },
  modalButton: {
    flex: 1,
  },
  cancelButton: {
    backgroundColor: colors.neutral200,
  },
  payButton: {
    backgroundColor: colors.success,
  },
});
