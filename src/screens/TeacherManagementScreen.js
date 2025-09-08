import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Platform,
  Alert
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import GradientBackground from '../components/GradientBackground';
import AppCard from '../components/AppCard';
import AppButton from '../components/AppButton';
import AppInput from '../components/AppInput';
import LocationSelector from '../components/LocationSelector';
import { useStore } from '../store/store';
import { useModal } from '../hooks/useModal';
import CustomModal from '../components/CustomModal';
import { colors, typography, spacing, radii, elevation } from '../theme/theme';

export default function TeacherManagementScreen({ navigation }) {
  const { state, actions } = useStore();
  const { modalVisible, modalConfig, showConfirm, hideModal } = useModal();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    price: '',
    province: '',
    city: '',
    experience: '',
    email: '',
    phone: ''
  });

  const statusOptions = [
    { label: 'Todos', value: 'all' },
    { label: 'Activos', value: 'active' },
    { label: 'Inactivos', value: 'inactive' },
    { label: 'Pendientes', value: 'pending' }
  ];

  const filteredTeachers = state.teachers.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         teacher.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         teacher.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || teacher.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const onRefresh = async () => {
    setRefreshing(true);
    // Simular carga de datos
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleAddTeacher = () => {
    setEditingTeacher(null);
    setFormData({
      name: '',
      subject: '',
      price: '',
      province: '',
      city: '',
      experience: '',
      email: '',
      phone: ''
    });
    setShowAddForm(true);
  };

  const handleEditTeacher = (teacher) => {
    setEditingTeacher(teacher);
    // Extraer provincia y ciudad de la ubicación actual
    let province = '';
    let city = '';
    
    if (teacher.location) {
      const locationParts = teacher.location.split(', ');
      if (locationParts.length >= 2) {
        city = locationParts[0].trim();
        province = locationParts[1].trim();
      } else {
        // Si solo hay una parte, asumir que es la ciudad
        city = locationParts[0].trim();
      }
    }
    
    setFormData({
      name: teacher.name,
      subject: teacher.subject,
      price: teacher.price.toString(),
      province: province,
      city: city,
      experience: teacher.experience,
      email: teacher.email || '',
      phone: teacher.phone || ''
    });
    setShowAddForm(true);
  };

  const validateForm = () => {
    const errors = [];
    
    if (!formData.name || formData.name.trim().length < 2) {
      errors.push('El nombre debe tener al menos 2 caracteres');
    }
    
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.push('Ingresa un email válido');
    }
    
    if (!formData.phone || formData.phone.trim().length < 10) {
      errors.push('El teléfono debe tener al menos 10 dígitos');
    }
    
    if (!formData.subject || formData.subject.trim().length < 2) {
      errors.push('La materia es obligatoria');
    }
    
    if (!formData.price || isNaN(formData.price) || parseInt(formData.price) <= 0) {
      errors.push('El precio debe ser un número válido mayor a 0');
    }
    
    if (!formData.province || !formData.city) {
      errors.push('Debes seleccionar provincia y ciudad');
    }
    
    return errors;
  };

  const handleSaveTeacher = () => {
    const validationErrors = validateForm();
    
    if (validationErrors.length > 0) {
      Alert.alert('Error de Validación', validationErrors.join('\n'));
      return;
    }

    const teacherData = {
      ...formData,
      id: editingTeacher ? editingTeacher.id : `t_${Date.now()}`,
      price: parseInt(formData.price),
      location: `${formData.city}, ${formData.province}`,
      rating: editingTeacher ? editingTeacher.rating : 5.0,
      status: editingTeacher ? editingTeacher.status : 'active'
    };

    // Remover provincia y ciudad del objeto final ya que se combinan en location
    delete teacherData.province;
    delete teacherData.city;

    if (editingTeacher) {
      actions.updateTeacher(teacherData);
      Alert.alert('Éxito', 'Docente actualizado correctamente');
    } else {
      actions.addTeacher(teacherData);
      Alert.alert('Éxito', 'Docente agregado correctamente');
    }

    setShowAddForm(false);
    setEditingTeacher(null);
  };

  const handleDeleteTeacher = (teacherId, teacherName) => {
    showConfirm(
      'Eliminar Docente',
      `¿Estás seguro de que quieres eliminar a ${teacherName}?`,
      () => {
        actions.deleteTeacher(teacherId);
        hideModal();
      }
    );
  };

  const handleToggleStatus = (teacher) => {
    const newStatus = teacher.status === 'active' ? 'inactive' : 'active';
    actions.updateTeacher({ ...teacher, status: newStatus });
  };

  const handleLocationSelect = (province, city) => {
    setFormData(prev => ({
      ...prev,
      province,
      city
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return colors.success;
      case 'inactive': return colors.danger;
      case 'pending': return colors.warning;
      default: return colors.neutral500;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'inactive': return 'Inactivo';
      case 'pending': return 'Pendiente';
      default: return 'Desconocido';
    }
  };

  const TeacherCard = ({ teacher }) => (
    <AppCard style={styles.teacherCard}>
      <View style={styles.teacherHeader}>
        <View style={styles.teacherInfo}>
          <Text style={styles.teacherName}>{teacher.name}</Text>
          <Text style={styles.teacherSubject}>{teacher.subject}</Text>
        </View>
        <View style={styles.teacherActions}>
          <TouchableOpacity
            style={[styles.statusBadge, { backgroundColor: getStatusColor(teacher.status) }]}
            onPress={() => handleToggleStatus(teacher)}
          >
            <Text style={styles.statusText}>{getStatusText(teacher.status)}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.teacherDetails}>
        <View style={styles.detailRow}>
          <MaterialIcons name="location-on" size={16} color={colors.primary} />
          <Text style={styles.detailText}>
            {teacher.location ? teacher.location : 'Ubicación no especificada'}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <MaterialIcons name="attach-money" size={16} color={colors.success} />
          <Text style={styles.detailText}>${teacher.price}/hora</Text>
        </View>
        <View style={styles.detailRow}>
          <MaterialIcons name="work" size={16} color={colors.warning} />
          <Text style={styles.detailText}>{teacher.experience}</Text>
        </View>
        <View style={styles.detailRow}>
          <MaterialIcons name="star" size={16} color={colors.accent} />
          <Text style={styles.detailText}>{teacher.rating}/5.0</Text>
        </View>
      </View>

      <View style={styles.cardActions}>
        <AppButton
          title="Editar"
          variant="outline"
          size="sm"
          onPress={() => handleEditTeacher(teacher)}
          style={styles.actionButton}
        />
        <AppButton
          title="Eliminar"
          variant="danger"
          size="sm"
          onPress={() => handleDeleteTeacher(teacher.id, teacher.name)}
          style={styles.actionButton}
        />
      </View>
    </AppCard>
  );

  const AddTeacherForm = () => (
    <AppCard style={styles.formCard}>
      <View style={styles.formHeader}>
        <View style={styles.formTitleContainer}>
          <MaterialIcons 
            name={editingTeacher ? "edit" : "person-add"} 
            size={24} 
            color={colors.primary} 
          />
          <Text style={styles.formTitle}>
            {editingTeacher ? 'Editar Docente' : 'Agregar Nuevo Docente'}
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={() => setShowAddForm(false)}
        >
          <MaterialIcons name="close" size={24} color={colors.neutral500} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.formContent} showsVerticalScrollIndicator={false}>
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Información Personal</Text>
          
          <AppInput
            label="Nombre completo *"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            placeholder="Ingresa el nombre completo del docente"
            leftIcon="person"
            variant="modern"
            size="md"
            style={styles.inputField}
          />
          
          <AppInput
            label="Email *"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            placeholder="docente@email.com"
            keyboardType="email-address"
            leftIcon="email"
            variant="modern"
            size="md"
            style={styles.inputField}
          />
          
          <AppInput
            label="Teléfono *"
            value={formData.phone}
            onChangeText={(text) => setFormData({ ...formData, phone: text })}
            placeholder="+593 99 123 4567"
            keyboardType="phone-pad"
            leftIcon="phone"
            variant="modern"
            size="md"
            style={styles.inputField}
          />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Información Profesional</Text>
          
          <AppInput
            label="Materia *"
            value={formData.subject}
            onChangeText={(text) => setFormData({ ...formData, subject: text })}
            placeholder="Ej: Matemáticas, Física, Química"
            leftIcon="school"
            variant="modern"
            size="md"
            style={styles.inputField}
          />
          
          <AppInput
            label="Precio por hora *"
            value={formData.price}
            onChangeText={(text) => setFormData({ ...formData, price: text })}
            placeholder="25"
            keyboardType="numeric"
            leftIcon="attach-money"
            variant="modern"
            size="md"
            style={styles.inputField}
          />
          
          <AppInput
            label="Experiencia"
            value={formData.experience}
            onChangeText={(text) => setFormData({ ...formData, experience: text })}
            placeholder="Ej: 5 años de experiencia"
            leftIcon="work"
            variant="modern"
            size="md"
            style={styles.inputField}
          />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Ubicación</Text>
          <LocationSelector
            selectedProvince={formData.province}
            selectedCity={formData.city}
            onLocationSelect={handleLocationSelect}
          />
        </View>
      </ScrollView>

      <View style={styles.formActions}>
        <AppButton
          title="Cancelar"
          variant="outline"
          onPress={() => setShowAddForm(false)}
          style={styles.formButton}
          size="md"
        />
        <AppButton
          title={editingTeacher ? 'Actualizar Docente' : 'Agregar Docente'}
          onPress={handleSaveTeacher}
          style={styles.formButton}
          size="md"
        />
      </View>
    </AppCard>
  );

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
          <Text style={styles.headerTitle}>Gestión de Docentes</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddTeacher}
          >
            <MaterialIcons name="add" size={24} color={colors.white} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.content}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Filtros y búsqueda */}
          <AppCard style={styles.filtersCard}>
            <AppInput
              leftIcon="search"
              placeholder="Buscar docentes..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.searchInput}
            />
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
              {statusOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.filterChip,
                    filterStatus === option.value && styles.filterChipActive
                  ]}
                  onPress={() => setFilterStatus(option.value)}
                >
                  <Text style={[
                    styles.filterChipText,
                    filterStatus === option.value && styles.filterChipTextActive
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </AppCard>

          {/* Formulario de agregar/editar */}
          {showAddForm && <AddTeacherForm />}

          {/* Lista de docentes */}
          <View style={styles.teachersList}>
            <Text style={styles.sectionTitle}>
              Docentes ({filteredTeachers.length})
            </Text>
            
            {filteredTeachers.length === 0 ? (
              <AppCard style={styles.emptyState}>
                <MaterialIcons name="school" size={48} color={colors.neutral400} />
                <Text style={styles.emptyText}>No se encontraron docentes</Text>
                <Text style={styles.emptySubtext}>
                  {searchQuery ? 'Intenta con otros términos de búsqueda' : 'Agrega el primer docente'}
                </Text>
              </AppCard>
            ) : (
              filteredTeachers.map((teacher) => (
                <TeacherCard key={teacher.id} teacher={teacher} />
              ))
            )}
          </View>
        </ScrollView>
      </View>

      <CustomModal
        visible={modalVisible}
        onClose={hideModal}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
        buttons={modalConfig.buttons}
      />
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
  addButton: {
    padding: spacing.sm,
  },
  content: {
    flex: 1,
    padding: spacing.xl,
  },
  filtersCard: {
    marginBottom: spacing.lg,
  },
  searchInput: {
    marginBottom: spacing.md,
  },
  filtersContainer: {
    marginTop: spacing.sm,
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
  formCard: {
    marginBottom: spacing.lg,
    ...elevation.lg,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral200,
  },
  formTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  formTitle: {
    ...typography.h4,
    color: colors.neutral900,
    fontWeight: '700',
    marginLeft: spacing.sm,
  },
  closeButton: {
    padding: spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.neutral100,
  },
  formContent: {
    maxHeight: 500,
  },
  formSection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h5,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: spacing.lg,
    paddingLeft: spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  inputField: {
    marginBottom: spacing.md,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xl,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.neutral200,
  },
  formButton: {
    flex: 1,
    marginHorizontal: spacing.sm,
  },
  teachersList: {
    marginTop: spacing.sm,
  },
  sectionTitle: {
    ...typography.subtitle,
    color: colors.neutral900,
    marginBottom: spacing.lg,
    fontWeight: '700',
  },
  teacherCard: {
    marginBottom: spacing.md,
  },
  teacherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  teacherInfo: {
    flex: 1,
  },
  teacherName: {
    ...typography.subtitle,
    color: colors.neutral900,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  teacherSubject: {
    ...typography.bodySmall,
    color: colors.neutral600,
  },
  teacherActions: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radii.sm,
  },
  statusText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: '600',
    fontSize: 11,
  },
  teacherDetails: {
    marginBottom: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  detailText: {
    ...typography.bodySmall,
    color: colors.neutral600,
    marginLeft: spacing.sm,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing['3xl'],
  },
  emptyText: {
    ...typography.subtitle,
    color: colors.neutral600,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  emptySubtext: {
    ...typography.bodySmall,
    color: colors.neutral500,
    textAlign: 'center',
  },
});
