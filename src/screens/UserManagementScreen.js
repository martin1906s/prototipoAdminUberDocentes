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
import { useStore } from '../store/store';
import { useModal } from '../hooks/useModal';
import CustomModal from '../components/CustomModal';
import { colors, typography, spacing, radii, elevation } from '../theme/theme';

export default function UserManagementScreen({ navigation }) {
  const { state, actions } = useStore();
  const { modalVisible, modalConfig, showConfirm, hideModal } = useModal();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    status: 'active'
  });

  // Extraer usuarios únicos de las propuestas
  const users = state.proposals.reduce((acc, proposal) => {
    const existingUser = acc.find(u => u.email === proposal.user.email);
    if (!existingUser) {
      acc.push({
        id: `u_${proposal.user.email}`,
        name: proposal.user.nombre,
        email: proposal.user.email,
        phone: proposal.user.telefono,
        city: 'Quito', // Por defecto
        status: 'active',
        proposalsCount: state.proposals.filter(p => p.user.email === proposal.user.email).length,
        lastActivity: proposal.date
      });
    }
    return acc;
  }, []);

  const statusOptions = [
    { label: 'Todos', value: 'all' },
    { label: 'Activos', value: 'active' },
    { label: 'Inactivos', value: 'inactive' },
    { label: 'Suspendidos', value: 'suspended' }
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.city.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      city: '',
      status: 'active'
    });
    setShowAddForm(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      city: user.city,
      status: user.status
    });
    setShowAddForm(true);
  };

  const handleSaveUser = () => {
    if (!formData.name || !formData.email) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios');
      return;
    }

    // En una implementación real, aquí se guardaría en el store
    Alert.alert('Éxito', editingUser ? 'Usuario actualizado correctamente' : 'Usuario agregado correctamente');
    setShowAddForm(false);
    setEditingUser(null);
  };

  const handleDeleteUser = (userId, userName) => {
    showConfirm(
      'Eliminar Usuario',
      `¿Estás seguro de que quieres eliminar a ${userName}?`,
      () => {
        // En una implementación real, aquí se eliminaría del store
        Alert.alert('Éxito', 'Usuario eliminado correctamente');
        hideModal();
      }
    );
  };

  const handleToggleStatus = (user) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    // En una implementación real, aquí se actualizaría en el store
    Alert.alert('Éxito', `Usuario ${newStatus === 'active' ? 'activado' : 'desactivado'} correctamente`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return colors.success;
      case 'inactive': return colors.danger;
      case 'suspended': return colors.warning;
      default: return colors.neutral500;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'inactive': return 'Inactivo';
      case 'suspended': return 'Suspendido';
      default: return 'Desconocido';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const UserCard = ({ user }) => (
    <AppCard style={styles.userCard}>
      <View style={styles.userHeader}>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>
        <View style={styles.userActions}>
          <TouchableOpacity
            style={[styles.statusBadge, { backgroundColor: getStatusColor(user.status) }]}
            onPress={() => handleToggleStatus(user)}
          >
            <Text style={styles.statusText}>{getStatusText(user.status)}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.userDetails}>
        <View style={styles.detailRow}>
          <MaterialIcons name="phone" size={16} color={colors.primary} />
          <Text style={styles.detailText}>{user.phone}</Text>
        </View>
        <View style={styles.detailRow}>
          <MaterialIcons name="location-on" size={16} color={colors.success} />
          <Text style={styles.detailText}>{user.city}</Text>
        </View>
        <View style={styles.detailRow}>
          <MaterialIcons name="description" size={16} color={colors.warning} />
          <Text style={styles.detailText}>{user.proposalsCount} propuestas</Text>
        </View>
        <View style={styles.detailRow}>
          <MaterialIcons name="schedule" size={16} color={colors.accent} />
          <Text style={styles.detailText}>Última actividad: {formatDate(user.lastActivity)}</Text>
        </View>
      </View>

      <View style={styles.cardActions}>
        <AppButton
          title="Editar"
          variant="outline"
          size="sm"
          onPress={() => handleEditUser(user)}
          style={styles.actionButton}
        />
        <AppButton
          title="Eliminar"
          variant="danger"
          size="sm"
          onPress={() => handleDeleteUser(user.id, user.name)}
          style={styles.actionButton}
        />
      </View>
    </AppCard>
  );

  const AddUserForm = () => (
    <AppCard style={styles.formCard}>
      <View style={styles.formHeader}>
        <Text style={styles.formTitle}>
          {editingUser ? 'Editar Usuario' : 'Agregar Nuevo Usuario'}
        </Text>
        <TouchableOpacity onPress={() => setShowAddForm(false)}>
          <MaterialIcons name="close" size={24} color={colors.neutral500} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.formContent}>
        <AppInput
          label="Nombre completo *"
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          placeholder="Ingresa el nombre del usuario"
        />
        
        <AppInput
          label="Email *"
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          placeholder="usuario@email.com"
          keyboardType="email-address"
        />
        
        <AppInput
          label="Teléfono"
          value={formData.phone}
          onChangeText={(text) => setFormData({ ...formData, phone: text })}
          placeholder="+593 99 123 4567"
          keyboardType="phone-pad"
        />
        
        <AppInput
          label="Ciudad"
          value={formData.city}
          onChangeText={(text) => setFormData({ ...formData, city: text })}
          placeholder="Quito, Guayaquil, Cuenca..."
        />
      </ScrollView>

      <View style={styles.formActions}>
        <AppButton
          title="Cancelar"
          variant="outline"
          onPress={() => setShowAddForm(false)}
          style={styles.formButton}
        />
        <AppButton
          title={editingUser ? 'Actualizar' : 'Agregar'}
          onPress={handleSaveUser}
          style={styles.formButton}
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
          <Text style={styles.headerTitle}>Gestión de Usuarios</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddUser}
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
              placeholder="Buscar usuarios..."
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

          {/* Estadísticas rápidas */}
          <View style={styles.statsContainer}>
            <AppCard style={styles.statCard}>
              <Text style={styles.statNumber}>{users.length}</Text>
              <Text style={styles.statLabel}>Total Usuarios</Text>
            </AppCard>
            <AppCard style={styles.statCard}>
              <Text style={[styles.statNumber, { color: colors.success }]}>
                {users.filter(u => u.status === 'active').length}
              </Text>
              <Text style={styles.statLabel}>Activos</Text>
            </AppCard>
            <AppCard style={styles.statCard}>
              <Text style={[styles.statNumber, { color: colors.warning }]}>
                {users.filter(u => u.status === 'inactive').length}
              </Text>
              <Text style={styles.statLabel}>Inactivos</Text>
            </AppCard>
            <AppCard style={styles.statCard}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>
                {users.reduce((acc, user) => acc + user.proposalsCount, 0)}
              </Text>
              <Text style={styles.statLabel}>Propuestas</Text>
            </AppCard>
          </View>

          {/* Formulario de agregar/editar */}
          {showAddForm && <AddUserForm />}

          {/* Lista de usuarios */}
          <View style={styles.usersList}>
            <Text style={styles.sectionTitle}>
              Usuarios ({filteredUsers.length})
            </Text>
            
            {filteredUsers.length === 0 ? (
              <AppCard style={styles.emptyState}>
                <MaterialIcons name="people" size={48} color={colors.neutral400} />
                <Text style={styles.emptyText}>No se encontraron usuarios</Text>
                <Text style={styles.emptySubtext}>
                  {searchQuery ? 'Intenta con otros términos de búsqueda' : 'Agrega el primer usuario'}
                </Text>
              </AppCard>
            ) : (
              filteredUsers.map((user) => (
                <UserCard key={user.id} user={user} />
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
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  statCard: {
    width: '48%',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingVertical: spacing.md,
  },
  statNumber: {
    ...typography.title,
    fontSize: 20,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...typography.caption,
    color: colors.neutral600,
    textAlign: 'center',
    fontSize: 10,
  },
  usersList: {
    marginTop: spacing.sm,
  },
  sectionTitle: {
    ...typography.subtitle,
    color: colors.neutral900,
    marginBottom: spacing.lg,
    fontWeight: '700',
  },
  userCard: {
    marginBottom: spacing.md,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    ...typography.subtitle,
    color: colors.neutral900,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  userEmail: {
    ...typography.bodySmall,
    color: colors.neutral600,
  },
  userActions: {
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
  userDetails: {
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
  formCard: {
    marginBottom: spacing.lg,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  formTitle: {
    ...typography.subtitle,
    color: colors.neutral900,
    fontWeight: '700',
  },
  formContent: {
    maxHeight: 300,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
  },
  formButton: {
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
