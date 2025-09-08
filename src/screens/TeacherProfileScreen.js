import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import GradientBackground from '../components/GradientBackground';
import AppCard from '../components/AppCard';
import AppInput from '../components/AppInput';
import AppButton from '../components/AppButton';
import LocationSelector from '../components/LocationSelector';
import OptionsMenu from '../components/OptionsMenu';
import { MaterialIcons } from '@expo/vector-icons';
import { ChipGroup } from '../components/Chips';
import { useStore } from '../store/store';
import { colors, typography, radii } from '../theme/theme';
import { SPACING } from '../utils/constants';

export default function TeacherProfileScreen({ navigation }) {
  const { state, actions } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  
  const [nombre, setNombre] = useState(state.teacherProfile?.nombre || '');
  const [email, setEmail] = useState(state.teacherProfile?.email || '');
  const [telefono, setTelefono] = useState(state.teacherProfile?.telefono || '');
  const [especialidades, setEspecialidades] = useState(state.teacherProfile?.especialidades || []);
  const [experiencia, setExperiencia] = useState(state.teacherProfile?.experiencia || '');
  const [descripcion, setDescripcion] = useState(state.teacherProfile?.descripcion || '');
  const [precioHora, setPrecioHora] = useState(state.teacherProfile?.precioHora?.toString() || '');
  const [ubicacion, setUbicacion] = useState(state.teacherProfile?.ubicacion || '');
  const [provincia, setProvincia] = useState(state.teacherProfile?.provincia || '');
  const [ciudad, setCiudad] = useState(state.teacherProfile?.ciudad || '');
  const [tipoInstitucion, setTipoInstitucion] = useState(state.teacherProfile?.tipoInstitucion || '');
  const [nivelEstudiantil, setNivelEstudiantil] = useState(state.teacherProfile?.nivelEstudiantil || []);
  const [disponibilidad, setDisponibilidad] = useState(state.teacherProfile?.disponibilidad || '');

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

  const handleLocationSelect = (selectedProvincia, selectedCiudad) => {
    setProvincia(selectedProvincia);
    setCiudad(selectedCiudad);
    setUbicacion(`${selectedCiudad}, ${selectedProvincia}`);
  };

  const handleSave = () => {
    try {
      const newErrors = {};
      
      if (!nombre) newErrors.nombre = 'Nombre es obligatorio';
      if (!email) newErrors.email = 'Email es obligatorio';
      if (!telefono) newErrors.telefono = 'Teléfono es obligatorio';
      
      if (Object.keys(newErrors).length > 0) {
        Alert.alert('Campos obligatorios', 'Completa todos los campos requeridos.');
        return;
      }
      
      const updatedProfile = {
        ...state.teacherProfile,
        nombre,
        email,
        telefono,
        especialidades,
        experiencia,
        descripcion,
        precioHora: parseFloat(precioHora) || 0,
        ubicacion,
        provincia,
        ciudad,
        tipoInstitucion,
        nivelEstudiantil,
        disponibilidad,
      };
      
      actions.saveTeacherProfile(updatedProfile);
      setIsEditing(false);
      Alert.alert('Éxito', 'Perfil actualizado correctamente');
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al guardar el perfil. Inténtalo de nuevo.');
    }
  };

  const handleCancel = () => {
    setNombre(state.teacherProfile?.nombre || '');
    setEmail(state.teacherProfile?.email || '');
    setTelefono(state.teacherProfile?.telefono || '');
    setEspecialidades(state.teacherProfile?.especialidades || []);
    setExperiencia(state.teacherProfile?.experiencia || '');
    setDescripcion(state.teacherProfile?.descripcion || '');
    setPrecioHora(state.teacherProfile?.precioHora?.toString() || '');
    setUbicacion(state.teacherProfile?.ubicacion || '');
    setProvincia(state.teacherProfile?.provincia || '');
    setCiudad(state.teacherProfile?.ciudad || '');
    setTipoInstitucion(state.teacherProfile?.tipoInstitucion || '');
    setNivelEstudiantil(state.teacherProfile?.nivelEstudiantil || []);
    setDisponibilidad(state.teacherProfile?.disponibilidad || '');
    setIsEditing(false);
  };

  const stats = [
    { label: 'Propuestas Recibidas', value: state.proposals?.length || 0, icon: '📨', color: '#06B6D4' },
    { label: 'Propuestas Aceptadas', value: state.proposals?.filter(p => p.estado === 'aceptada').length || 0, icon: '✅', color: '#10B981' },
    { label: 'Estudiantes Activos', value: '12', icon: '👥', color: '#8B5CF6' },
  ];

  return (
    <GradientBackground variant="white" theme="teacherSetup">
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.welcomeSection}>
              <View style={styles.welcomeIconContainer}>
                <Text style={styles.welcomeEmoji}>👨‍🏫</Text>
              </View>
              <View style={styles.welcomeTextContainer}>
                <Text style={styles.welcomeText}>Mi Perfil</Text>
                <Text style={styles.welcomeSubtext}>Gestiona tu información profesional</Text>
              </View>
            </View>
            <OptionsMenu navigation={navigation} theme="teacherSetup" />
          </View>
        </View>

        {/* Estadísticas */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>📊 Estadísticas</Text>
          <View style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <View key={`stat-${stat.label}-${index}`} style={[styles.statCard, { backgroundColor: stat.color + '10' }]}>
                <Text style={styles.statIcon}>{stat.icon}</Text>
                <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Información del perfil reorganizada */}
        <View style={styles.profileSection}>
          <Text style={styles.sectionTitle}>👨‍🏫 Información Personal</Text>
          
          {/* Header con foto y botón de editar */}
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {nombre ? nombre.charAt(0).toUpperCase() : '👨‍🏫'}
                </Text>
              </View>
              <TouchableOpacity style={styles.cameraButton}>
                <MaterialIcons name="camera-alt" size={16} color="white" />
              </TouchableOpacity>
            </View>
            
            <AppButton
              title={isEditing ? 'Cancelar' : 'Editar'}
              leftIcon={isEditing ? "close" : "edit"}
              onPress={() => setIsEditing(!isEditing)}
              variant={isEditing ? "outline" : "primary"}
              size="sm"
              style={styles.editButton}
            />
          </View>

          {/* Cards de información personal */}
          <View style={styles.infoCardsContainer}>
            <View style={styles.infoCardsRow}>
              <AppCard style={styles.infoCard}>
                <View style={styles.infoCardHeader}>
                  <MaterialIcons name="person" size={20} color="#06B6D4" />
                  <Text style={styles.infoCardTitle}>Nombre</Text>
                </View>
                {isEditing ? (
                  <AppInput
                    value={nombre}
                    onChangeText={setNombre}
                    placeholder="Ingresa tu nombre completo"
                    style={styles.compactInput}
                  />
                ) : (
                  <Text style={styles.infoCardValue}>{nombre || 'No especificado'}</Text>
                )}
              </AppCard>

              <AppCard style={styles.infoCard}>
                <View style={styles.infoCardHeader}>
                  <MaterialIcons name="email" size={20} color="#10B981" />
                  <Text style={styles.infoCardTitle}>Email</Text>
                </View>
                {isEditing ? (
                  <AppInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="tu@email.com"
                    keyboardType="email-address"
                    style={styles.compactInput}
                  />
                ) : (
                  <Text style={styles.infoCardValue}>{email || 'No especificado'}</Text>
                )}
              </AppCard>
            </View>

            {/* Teléfono y Ubicación en una fila */}
            <View style={styles.infoCardsRow}>
              <AppCard style={styles.infoCard}>
                <View style={styles.infoCardHeader}>
                  <MaterialIcons name="phone" size={20} color="#F59E0B" />
                  <Text style={styles.infoCardTitle}>Teléfono</Text>
                </View>
                {isEditing ? (
                  <AppInput
                    value={telefono}
                    onChangeText={setTelefono}
                    placeholder="+593 99 999 9999"
                    keyboardType="phone-pad"
                    style={styles.compactInput}
                  />
                ) : (
                  <Text style={styles.infoCardValue}>{telefono || 'No especificado'}</Text>
                )}
              </AppCard>

              <AppCard style={styles.infoCard}>
                <View style={styles.infoCardHeader}>
                  <MaterialIcons name="location-on" size={20} color="#EF4444" />
                  <Text style={styles.infoCardTitle}>Ubicación</Text>
                </View>
                {isEditing ? (
                  <LocationSelector
                    selectedProvince={provincia}
                    selectedCity={ciudad}
                    onLocationSelect={handleLocationSelect}
                    style={styles.locationSelector}
                  />
                ) : (
                  <Text style={styles.infoCardValue}>{ubicacion || 'No especificado'}</Text>
                )}
              </AppCard>
            </View>

            {/* Tipo de Institución en una fila completa */}
            <AppCard style={styles.fullWidthCard}>
              <View style={styles.infoCardHeader}>
                <MaterialIcons name="school" size={20} color="#10B981" />
                <Text style={styles.infoCardTitle}>Tipo de Institución</Text>
              </View>
              {isEditing ? (
                <ChipGroup
                  options={["Escuela", "Colegio", "Universidad"]}
                  value={tipoInstitucion}
                  onChange={setTipoInstitucion}
                  style={styles.compactChips}
                />
              ) : (
                <Text style={styles.infoCardValue}>{tipoInstitucion || 'No especificado'}</Text>
              )}
            </AppCard>

            {/* Niveles que enseña en una fila completa */}
            <AppCard style={styles.fullWidthCard}>
              <View style={styles.infoCardHeader}>
                <MaterialIcons name="class" size={20} color="#F59E0B" />
                <Text style={styles.infoCardTitle}>Niveles que enseña</Text>
              </View>
              {isEditing ? (
                <ChipGroup
                  options={["Primaria", "Secundaria", "Bachillerato", "Universidad", "Postgrado", "Adultos"]}
                  value={nivelEstudiantil}
                  onChange={setNivelEstudiantil}
                  style={styles.compactChips}
                  multiple={true}
                />
              ) : (
                <View style={styles.levelsDisplay}>
                  {Array.isArray(nivelEstudiantil) && nivelEstudiantil.length > 0 ? (
                    nivelEstudiantil.map((level, index) => (
                      <View key={`level-${level}-${index}`} style={styles.levelTag}>
                        <Text style={styles.levelText}>{level}</Text>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.infoCardValue}>No especificado</Text>
                  )}
                </View>
              )}
            </AppCard>

            <View style={styles.infoCardsRow}>
              <AppCard style={styles.infoCard}>
                <View style={styles.infoCardHeader}>
                  <MaterialIcons name="school" size={20} color="#8B5CF6" />
                  <Text style={styles.infoCardTitle}>Especialidades</Text>
                </View>
                {isEditing ? (
                  <View style={styles.specialtiesEditContainer}>
                    <AppInput
                      placeholder="Agregar especialidad..."
                      style={styles.specialtyInput}
                      onSubmitEditing={(e) => {
                        const val = e.nativeEvent.text.trim();
                        if (val && !especialidades.includes(val)) {
                          setEspecialidades([...especialidades, val]);
                          e.target.clear();
                        }
                      }}
                    />
                    <View style={styles.specialtiesList}>
                      {especialidades.map((esp, index) => (
                        <View key={`specialty-${esp}-${index}`} style={styles.specialtyChip}>
                          <Text style={styles.specialtyChipText}>{esp}</Text>
                          <TouchableOpacity 
                            onPress={() => setEspecialidades(especialidades.filter((e) => e !== esp))}
                            style={styles.specialtyRemoveButton}
                          >
                            <MaterialIcons name="close" size={14} color={colors.danger} />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  </View>
                ) : (
                  <View style={styles.specialtiesDisplay}>
                    {especialidades.length > 0 ? (
                      especialidades.map((esp, index) => (
                        <View key={`specialty-display-${esp}-${index}`} style={styles.specialtyChip}>
                          <Text style={styles.specialtyChipText}>{esp}</Text>
                        </View>
                      ))
                    ) : (
                      <Text style={styles.infoCardValue}>No especificado</Text>
                    )}
                  </View>
                )}
              </AppCard>

              <AppCard style={styles.infoCard}>
                <View style={styles.infoCardHeader}>
                  <MaterialIcons name="work" size={20} color="#6366F1" />
                  <Text style={styles.infoCardTitle}>Experiencia</Text>
                </View>
                {isEditing ? (
                  <ChipGroup
                    options={["0-2 años", "3-5 años", "6-9 años", "10+ años"]}
                    value={experiencia}
                    onChange={setExperiencia}
                    style={styles.experienceChips}
                  />
                ) : (
                  <Text style={styles.infoCardValue}>{experiencia || 'No especificado'}</Text>
                )}
              </AppCard>
            </View>

            <View style={styles.infoCardsRow}>
              <AppCard style={styles.infoCard}>
                <View style={styles.infoCardHeader}>
                  <MaterialIcons name="attach-money" size={20} color="#10B981" />
                  <Text style={styles.infoCardTitle}>Precio/Hora</Text>
                </View>
                {isEditing ? (
                  <AppInput
                    value={precioHora}
                    onChangeText={setPrecioHora}
                    placeholder="25"
                    keyboardType="numeric"
                    style={styles.compactInput}
                  />
                ) : (
                  <Text style={styles.infoCardValue}>${precioHora || '0'}/hora</Text>
                )}
              </AppCard>

              <AppCard style={styles.infoCard}>
                <View style={styles.infoCardHeader}>
                  <MaterialIcons name="schedule" size={20} color="#06B6D4" />
                  <Text style={styles.infoCardTitle}>Disponibilidad</Text>
                </View>
                {isEditing ? (
                  <AppInput
                    value={disponibilidad}
                    onChangeText={setDisponibilidad}
                    placeholder="Lunes a Viernes, 8:00 - 18:00"
                    style={styles.compactInput}
                  />
                ) : (
                  <Text style={styles.infoCardValue}>{disponibilidad || 'No especificado'}</Text>
                )}
              </AppCard>
            </View>

            {/* Descripción en card completa */}
            <AppCard style={styles.descriptionCard}>
              <View style={styles.infoCardHeader}>
                <MaterialIcons name="description" size={20} color="#F59E0B" />
                <Text style={styles.infoCardTitle}>Descripción</Text>
              </View>
              {isEditing ? (
                <AppInput
                  value={descripcion}
                  onChangeText={setDescripcion}
                  placeholder="Cuéntanos sobre tu experiencia y metodología..."
                  multiline
                  numberOfLines={3}
                  style={styles.compactInput}
                />
              ) : (
                <Text style={styles.infoCardValue}>{descripcion || 'No especificado'}</Text>
              )}
            </AppCard>

            {isEditing && (
              <View style={styles.actionButtons}>
                <AppButton
                  title="Guardar cambios"
                  leftIcon="save"
                  onPress={handleSave}
                  style={styles.saveButton}
                />
                <AppButton
                  iconOnly
                  leftIcon="close"
                  onPress={handleCancel}
                  variant="danger"
                  size="sm"
                  style={styles.cancelButton}
                />
              </View>
            )}
          </View>
        </View>
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
  statsSection: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    ...typography.subtitle,
    color: '#581C87',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: SPACING.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.themes.teacherSetup.card,
    padding: SPACING.lg,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: SPACING.sm,
  },
  statValue: {
    ...typography.title,
    color: colors.themes.teacherSetup.text,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  statLabel: {
    ...typography.caption,
    color: '#6B7280',
    fontSize: 12,
    textAlign: 'center',
  },
  profileSection: {
    marginBottom: SPACING.lg,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.themes.teacherSetup.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  avatarText: {
    ...typography.title,
    color: 'white',
    fontSize: 32,
    fontWeight: '800',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: colors.themes.teacherSetup.primary,
    borderRadius: 12,
  },
  infoCardsContainer: {
    gap: SPACING.md,
  },
  infoCardsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  infoCard: {
    flex: 1,
    padding: SPACING.md,
  },
  descriptionCard: {
    padding: SPACING.md,
  },
  fullWidthCard: {
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  infoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  infoCardTitle: {
    ...typography.caption,
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: SPACING.xs,
  },
  infoCardValue: {
    ...typography.bodySmall,
    color: '#581C87',
    fontSize: 14,
    fontWeight: '500',
  },
  compactInput: {
    marginBottom: 0,
  },
  compactChips: {
    marginTop: SPACING.xs,
  },
  locationSelector: {
    marginTop: SPACING.xs,
  },
  levelsDisplay: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  levelTag: {
    backgroundColor: colors.warning + '15',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.warning + '30',
  },
  levelText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.warning,
  },
  specialtiesEditContainer: {
    gap: SPACING.sm,
  },
  specialtyInput: {
    marginBottom: 0,
  },
  specialtiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  specialtiesDisplay: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  specialtyChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.themes.teacherSetup.primary + '15',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.themes.teacherSetup.primary + '30',
  },
  specialtyChipText: {
    ...typography.caption,
    color: '#8B5CF6',
    fontSize: 12,
    fontWeight: '600',
  },
  specialtyRemoveButton: {
    marginLeft: SPACING.xs,
    padding: 2,
  },
  experienceChips: {
    marginTop: SPACING.xs,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.lg,
  },
  saveButton: {
    flex: 1,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.themes.teacherSetup.primary,
    borderRadius: 12,
  },
});
