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

export default function ProposalManagementScreen({ navigation }) {
  const { state, actions } = useStore();
  const { modalVisible, modalConfig, showConfirm, hideModal } = useModal();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const statusOptions = [
    { label: 'Todas', value: 'all' },
    { label: 'Pendientes', value: 'pendiente' },
    { label: 'Aceptadas', value: 'aceptada' },
    { label: 'Rechazadas', value: 'rechazada' }
  ];

  const filteredProposals = state.proposals.filter(proposal => {
    const matchesSearch = proposal.user.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         proposal.mensaje.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || proposal.estado === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleApproveProposal = (proposalId) => {
    showConfirm(
      'Aprobar Propuesta',
      '¿Estás seguro de que quieres aprobar esta propuesta?',
      () => {
        actions.updateProposalStatus(proposalId, 'aceptada');
        hideModal();
        Alert.alert('Éxito', 'Propuesta aprobada correctamente');
      }
    );
  };

  const handleRejectProposal = (proposalId) => {
    showConfirm(
      'Rechazar Propuesta',
      '¿Estás seguro de que quieres rechazar esta propuesta?',
      () => {
        actions.updateProposalStatus(proposalId, 'rechazada');
        hideModal();
        Alert.alert('Éxito', 'Propuesta rechazada correctamente');
      }
    );
  };

  const handleViewDetails = (proposal) => {
    setSelectedProposal(proposal);
    setShowDetails(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'aceptada': return colors.success;
      case 'pendiente': return colors.warning;
      case 'rechazada': return colors.danger;
      default: return colors.neutral500;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'aceptada': return 'Aceptada';
      case 'pendiente': return 'Pendiente';
      case 'rechazada': return 'Rechazada';
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

  const getTeacherName = (teacherId) => {
    const teacher = state.teachers.find(t => t.id === teacherId);
    return teacher ? teacher.name : 'Docente no encontrado';
  };

  const ProposalCard = ({ proposal }) => (
    <AppCard style={styles.proposalCard}>
      <View style={styles.proposalHeader}>
        <View style={styles.proposalInfo}>
          <Text style={styles.studentName}>{proposal.user.nombre}</Text>
          <Text style={styles.teacherName}>{getTeacherName(proposal.teacherId)}</Text>
        </View>
        <View style={styles.proposalStatus}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(proposal.estado) }]}>
            <Text style={styles.statusText}>{getStatusText(proposal.estado)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.proposalContent}>
        <Text style={styles.proposalMessage} numberOfLines={2}>
          {proposal.mensaje}
        </Text>
      </View>

      <View style={styles.proposalDetails}>
        <View style={styles.detailRow}>
          <MaterialIcons name="calendar-today" size={16} color={colors.primary} />
          <Text style={styles.detailText}>{formatDate(proposal.date)}</Text>
        </View>
        <View style={styles.detailRow}>
          <MaterialIcons name="attach-money" size={16} color={colors.success} />
          <Text style={styles.detailText}>${proposal.price}/hora</Text>
        </View>
        <View style={styles.detailRow}>
          <MaterialIcons name="email" size={16} color={colors.warning} />
          <Text style={styles.detailText}>{proposal.user.email}</Text>
        </View>
        <View style={styles.detailRow}>
          <MaterialIcons name="phone" size={16} color={colors.accent} />
          <Text style={styles.detailText}>{proposal.user.telefono}</Text>
        </View>
      </View>

      <View style={styles.cardActions}>
        <AppButton
          title="Ver Detalles"
          variant="outline"
          size="sm"
          onPress={() => handleViewDetails(proposal)}
          style={styles.actionButton}
        />
        {proposal.estado === 'pendiente' && (
          <>
            <AppButton
              title="Aprobar"
              variant="success"
              size="sm"
              onPress={() => handleApproveProposal(proposal.id)}
              style={styles.actionButton}
            />
            <AppButton
              title="Rechazar"
              variant="danger"
              size="sm"
              onPress={() => handleRejectProposal(proposal.id)}
              style={styles.actionButton}
            />
          </>
        )}
      </View>
    </AppCard>
  );

  const ProposalDetailsModal = () => {
    if (!selectedProposal) return null;

    return (
      <View style={styles.modalOverlay}>
        <AppCard style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Detalles de la Propuesta</Text>
            <TouchableOpacity onPress={() => setShowDetails(false)}>
              <MaterialIcons name="close" size={24} color={colors.neutral500} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <View style={styles.detailSection}>
              <Text style={styles.sectionTitle}>Información del Estudiante</Text>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Nombre:</Text>
                <Text style={styles.detailValue}>{selectedProposal.user.nombre}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Email:</Text>
                <Text style={styles.detailValue}>{selectedProposal.user.email}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Teléfono:</Text>
                <Text style={styles.detailValue}>{selectedProposal.user.telefono}</Text>
              </View>
            </View>

            <View style={styles.detailSection}>
              <Text style={styles.sectionTitle}>Información del Docente</Text>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Nombre:</Text>
                <Text style={styles.detailValue}>{getTeacherName(selectedProposal.teacherId)}</Text>
              </View>
            </View>

            <View style={styles.detailSection}>
              <Text style={styles.sectionTitle}>Detalles de la Clase</Text>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Mensaje:</Text>
                <Text style={styles.detailValue}>{selectedProposal.mensaje}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Precio:</Text>
                <Text style={styles.detailValue}>${selectedProposal.price}/hora</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Fecha:</Text>
                <Text style={styles.detailValue}>{formatDate(selectedProposal.date)}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Estado:</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(selectedProposal.estado) }]}>
                  <Text style={styles.statusText}>{getStatusText(selectedProposal.estado)}</Text>
                </View>
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalActions}>
            {selectedProposal.estado === 'pendiente' && (
              <>
                <AppButton
                  title="Aprobar"
                  variant="success"
                  onPress={() => {
                    handleApproveProposal(selectedProposal.id);
                    setShowDetails(false);
                  }}
                  style={styles.modalButton}
                />
                <AppButton
                  title="Rechazar"
                  variant="danger"
                  onPress={() => {
                    handleRejectProposal(selectedProposal.id);
                    setShowDetails(false);
                  }}
                  style={styles.modalButton}
                />
              </>
            )}
            <AppButton
              title="Cerrar"
              variant="outline"
              onPress={() => setShowDetails(false)}
              style={styles.modalButton}
            />
          </View>
        </AppCard>
      </View>
    );
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
          <Text style={styles.headerTitle}>Gestión de Propuestas</Text>
          <View style={styles.headerRight} />
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
              placeholder="Buscar propuestas..."
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
              <Text style={styles.statNumber}>{state.proposals.length}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </AppCard>
            <AppCard style={styles.statCard}>
              <Text style={[styles.statNumber, { color: colors.warning }]}>
                {state.proposals.filter(p => p.estado === 'pendiente').length}
              </Text>
              <Text style={styles.statLabel}>Pendientes</Text>
            </AppCard>
            <AppCard style={styles.statCard}>
              <Text style={[styles.statNumber, { color: colors.success }]}>
                {state.proposals.filter(p => p.estado === 'aceptada').length}
              </Text>
              <Text style={styles.statLabel}>Aceptadas</Text>
            </AppCard>
            <AppCard style={styles.statCard}>
              <Text style={[styles.statNumber, { color: colors.danger }]}>
                {state.proposals.filter(p => p.estado === 'rechazada').length}
              </Text>
              <Text style={styles.statLabel}>Rechazadas</Text>
            </AppCard>
          </View>

          {/* Lista de propuestas */}
          <View style={styles.proposalsList}>
            <Text style={styles.sectionTitle}>
              Propuestas ({filteredProposals.length})
            </Text>
            
            {filteredProposals.length === 0 ? (
              <AppCard style={styles.emptyState}>
                <MaterialIcons name="description" size={48} color={colors.neutral400} />
                <Text style={styles.emptyText}>No se encontraron propuestas</Text>
                <Text style={styles.emptySubtext}>
                  {searchQuery ? 'Intenta con otros términos de búsqueda' : 'No hay propuestas disponibles'}
                </Text>
              </AppCard>
            ) : (
              filteredProposals.map((proposal) => (
                <ProposalCard key={proposal.id} proposal={proposal} />
              ))
            )}
          </View>
        </ScrollView>
      </View>

      {/* Modal de detalles */}
      {showDetails && <ProposalDetailsModal />}

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
  headerRight: {
    width: 40,
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
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: spacing.xs,
    paddingVertical: spacing.md,
  },
  statNumber: {
    ...typography.title,
    fontSize: 24,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...typography.caption,
    color: colors.neutral600,
    textAlign: 'center',
  },
  proposalsList: {
    marginTop: spacing.sm,
  },
  sectionTitle: {
    ...typography.subtitle,
    color: colors.neutral900,
    marginBottom: spacing.lg,
    fontWeight: '700',
  },
  proposalCard: {
    marginBottom: spacing.md,
  },
  proposalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  proposalInfo: {
    flex: 1,
  },
  studentName: {
    ...typography.subtitle,
    color: colors.neutral900,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  teacherName: {
    ...typography.bodySmall,
    color: colors.neutral600,
  },
  proposalStatus: {
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
  proposalContent: {
    marginBottom: spacing.md,
  },
  proposalMessage: {
    ...typography.body,
    color: colors.neutral700,
    lineHeight: 20,
  },
  proposalDetails: {
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
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  modalContent: {
    width: '100%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  modalTitle: {
    ...typography.subtitle,
    color: colors.neutral900,
    fontWeight: '700',
  },
  modalBody: {
    maxHeight: 400,
  },
  detailSection: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  detailLabel: {
    ...typography.bodySmall,
    color: colors.neutral600,
    fontWeight: '600',
  },
  detailValue: {
    ...typography.bodySmall,
    color: colors.neutral900,
    flex: 1,
    textAlign: 'right',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
});
