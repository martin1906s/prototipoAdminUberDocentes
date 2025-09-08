import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ScrollView, Dimensions, Modal, Alert } from 'react-native';
import GradientBackground from '../components/GradientBackground';
import AppCard from '../components/AppCard';
import AppButton from '../components/AppButton';
import OptionsMenu from '../components/OptionsMenu';
import { useStore } from '../store/store';
import { colors, radii, typography, elevation } from '../theme/theme';
import { SPACING } from '../utils/constants';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function TeacherProposalsScreen({ navigation }) {
  const { state, actions } = useStore();
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const proposals = useMemo(() => state.proposals || [], [state.proposals]);
  const teacherProfile = state.teacherProfile;

  // Calcular estadísticas
  const stats = useMemo(() => {
    const total = proposals.length;
    const pendientes = proposals.filter(p => p.estado === 'pendiente').length;
    const aceptadas = proposals.filter(p => p.estado === 'aceptada').length;
    const rechazadas = proposals.filter(p => p.estado === 'rechazada').length;
    
    return { total, pendientes, aceptadas, rechazadas };
  }, [proposals]);

  // Función para generar especificaciones simuladas
  const generateProposalDetails = (proposal) => {
    const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    const hours = ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];
    const quitoAddresses = [
      'Av. Amazonas N34-123 y Av. República, Quito',
      'Calle Juan León Mera N24-123 y Av. 6 de Diciembre, Quito',
      'Av. 12 de Octubre N24-123 y Av. Colón, Quito',
      'Calle Reina Victoria N24-123 y Av. 6 de Diciembre, Quito',
      'Av. Mariscal Sucre N34-123 y Av. 10 de Agosto, Quito',
      'Calle Guayaquil N24-123 y Av. 6 de Diciembre, Quito',
      'Av. 6 de Diciembre N24-123 y Av. Colón, Quito',
      'Calle Amazonas N34-123 y Av. 10 de Agosto, Quito'
    ];

    // Usar el ID de la propuesta para generar datos consistentes
    const proposalId = proposal.id || 1;
    const dayIndex = proposalId % days.length;
    const hourIndex = (proposalId + 1) % hours.length;
    const addressIndex = (proposalId + 2) % quitoAddresses.length;
    const modalityIndex = proposalId % 2;
    const levelIndex = proposalId % 3;

    return {
      dia: days[dayIndex],
      hora: hours[hourIndex],
      direccion: quitoAddresses[addressIndex],
      duracion: '2 horas',
      modalidad: modalityIndex === 0 ? 'Presencial' : 'Virtual',
      nivel: ['Básico', 'Intermedio', 'Avanzado'][levelIndex],
      precio: `$${15 + (proposalId % 20)}/hora`,
      observaciones: 'El estudiante prefiere clases prácticas con ejemplos reales.'
    };
  };

  const handleViewDetails = (proposal) => {
    setSelectedProposal({
      ...proposal,
      details: generateProposalDetails(proposal)
    });
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedProposal(null);
  };

  return (
    <GradientBackground variant="white" theme="teacherProposals">
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeEmoji}>📋</Text>
            <View style={styles.welcomeTextContainer}>
              <Text style={styles.welcomeText}>¡Hola, {teacherProfile?.nombre || 'Docente'}!</Text>
              <Text style={styles.subtitleText}>Gestiona tus propuestas de enseñanza</Text>
            </View>
          </View>
          
          <OptionsMenu navigation={navigation} theme="teacherProposals" />
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: colors.warning }]}>
            <Text style={styles.statEmoji}>📊</Text>
            <Text style={styles.statNumber}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: colors.info }]}>
            <Text style={styles.statEmoji}>⏳</Text>
            <Text style={styles.statNumber}>{stats.pendientes}</Text>
            <Text style={styles.statLabel}>Pendientes</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: colors.success }]}>
            <Text style={styles.statEmoji}>✅</Text>
            <Text style={styles.statNumber}>{stats.aceptadas}</Text>
            <Text style={styles.statLabel}>Aceptadas</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: colors.danger }]}>
            <Text style={styles.statEmoji}>❌</Text>
            <Text style={styles.statNumber}>{stats.rechazadas}</Text>
            <Text style={styles.statLabel}>Rechazadas</Text>
          </View>
        </View>

        {/* Proposals Section */}
        <View style={styles.proposalsSection}>
          <View style={styles.proposalsHeader}>
            <Text style={styles.sectionTitle}>📬 Propuestas Recientes</Text>
            <AppButton
              title="Filtros"
              leftIcon="filter-list"
              variant="outline"
              size="sm"
              style={styles.filterButton}
            />
          </View>

          {proposals.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateEmoji}>📭</Text>
              <Text style={styles.emptyStateTitle}>No hay propuestas aún</Text>
              <Text style={styles.emptyStateText}>
                Cuando los estudiantes te contacten, aparecerán aquí
              </Text>
            </View>
          ) : (
            <View style={styles.proposalsList}>
              {proposals.map((item) => (
                <View key={item.id} style={styles.proposalCard}>
                  <View style={styles.proposalHeader}>
                    <View style={styles.userInfo}>
                      <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                          {item.user.nombre.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                      <View style={styles.userDetails}>
                        <Text style={styles.userName}>{item.user.nombre}</Text>
                        <Text style={styles.userContact}>{item.user.email}</Text>
                      </View>
                    </View>
                    <View style={[styles.statusBadge, { 
                      backgroundColor: item.estado === 'pendiente' ? colors.warning : 
                                     item.estado === 'aceptada' ? colors.success : colors.danger 
                    }]}>
                      <Text style={styles.statusText}>{item.estado}</Text>
                    </View>
                  </View>
                  
                  <Text style={styles.proposalMessage}>{item.mensaje}</Text>
                  
                  <View style={styles.proposalActions}>
                    <AppButton
                      iconOnly
                      leftIcon="visibility"
                      onPress={() => handleViewDetails(item)}
                      variant="info"
                      size="sm"
                      style={[styles.actionButton, styles.detailsButton]}
                    />
                    
                    {item.estado === 'pendiente' && (
                      <>
                        <AppButton
                          iconOnly
                          leftIcon="check"
                          onPress={() => actions.updateProposalStatus(item.id, 'aceptada')}
                          variant="success"
                          size="sm"
                          style={[styles.actionButton, styles.acceptButton]}
                        />
                        
                        <AppButton
                          iconOnly
                          leftIcon="cancel"
                          onPress={() => actions.updateProposalStatus(item.id, 'rechazada')}
                          variant="danger"
                          size="sm"
                          style={[styles.actionButton, styles.rejectButton]}
                        />
                      </>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Modal de Detalles */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>📋 Detalles de la Propuesta</Text>
              <AppButton
                iconOnly
                leftIcon="close"
                onPress={closeModal}
                variant="ghost"
                size="sm"
                style={styles.closeButton}
              />
            </View>

            {selectedProposal && (
              <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
                {/* Información del Usuario */}
                <View style={styles.detailSection}>
                  <Text style={styles.sectionTitle}>👤 Información del Estudiante</Text>
                  <View style={styles.detailCard}>
                    <View style={styles.userInfo}>
                      <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                          {selectedProposal.user.nombre.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                      <View style={styles.userDetails}>
                        <Text style={styles.userName}>{selectedProposal.user.nombre}</Text>
                        <Text style={styles.userContact}>{selectedProposal.user.email}</Text>
                        <Text style={styles.userContact}>{selectedProposal.user.telefono}</Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Especificaciones de la Clase */}
                <View style={styles.detailSection}>
                  <Text style={styles.sectionTitle}>📅 Especificaciones de la Clase</Text>
                  <View style={styles.detailCard}>
                    <View style={styles.detailRow}>
                      <MaterialIcons name="calendar-today" size={20} color={colors.primary} />
                      <View style={styles.detailInfo}>
                        <Text style={styles.detailLabel}>Día</Text>
                        <Text style={styles.detailValue}>{selectedProposal.details.dia}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.detailRow}>
                      <MaterialIcons name="access-time" size={20} color={colors.primary} />
                      <View style={styles.detailInfo}>
                        <Text style={styles.detailLabel}>Hora</Text>
                        <Text style={styles.detailValue}>{selectedProposal.details.hora}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.detailRow}>
                      <MaterialIcons name="location-on" size={20} color={colors.primary} />
                      <View style={styles.detailInfo}>
                        <Text style={styles.detailLabel}>Dirección</Text>
                        <Text style={styles.detailValue}>{selectedProposal.details.direccion}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.detailRow}>
                      <MaterialIcons name="schedule" size={20} color={colors.primary} />
                      <View style={styles.detailInfo}>
                        <Text style={styles.detailLabel}>Duración</Text>
                        <Text style={styles.detailValue}>{selectedProposal.details.duracion}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.detailRow}>
                      <MaterialIcons name="computer" size={20} color={colors.primary} />
                      <View style={styles.detailInfo}>
                        <Text style={styles.detailLabel}>Modalidad</Text>
                        <Text style={styles.detailValue}>{selectedProposal.details.modalidad}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.detailRow}>
                      <MaterialIcons name="school" size={20} color={colors.primary} />
                      <View style={styles.detailInfo}>
                        <Text style={styles.detailLabel}>Nivel</Text>
                        <Text style={styles.detailValue}>{selectedProposal.details.nivel}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.detailRow}>
                      <MaterialIcons name="attach-money" size={20} color={colors.primary} />
                      <View style={styles.detailInfo}>
                        <Text style={styles.detailLabel}>Precio</Text>
                        <Text style={styles.detailValue}>{selectedProposal.details.precio}</Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Mensaje del Estudiante */}
                <View style={styles.detailSection}>
                  <Text style={styles.sectionTitle}>💬 Mensaje del Estudiante</Text>
                  <View style={styles.detailCard}>
                    <Text style={styles.messageText}>{selectedProposal.mensaje}</Text>
                  </View>
                </View>

                {/* Observaciones */}
                <View style={styles.detailSection}>
                  <Text style={styles.sectionTitle}>📝 Observaciones</Text>
                  <View style={styles.detailCard}>
                    <Text style={styles.observationsText}>{selectedProposal.details.observaciones}</Text>
                  </View>
                </View>
              </ScrollView>
            )}

            {/* Botones del Modal */}
            <View style={styles.modalActions}>
              <AppButton
                iconOnly
                leftIcon="close"
                onPress={closeModal}
                variant="outline"
                size="md"
                style={[styles.modalButton, styles.closeModalButton]}
              />
              
              {selectedProposal?.estado === 'pendiente' && (
                <View style={styles.modalActionButtons}>
                  <AppButton
                    iconOnly
                    leftIcon="check"
                    onPress={() => {
                      actions.updateProposalStatus(selectedProposal.id, 'aceptada');
                      closeModal();
                    }}
                    variant="success"
                    size="md"
                    style={[styles.modalButton, styles.acceptModalButton]}
                  />
                  
                  <AppButton
                    iconOnly
                    leftIcon="cancel"
                    onPress={() => {
                      actions.updateProposalStatus(selectedProposal.id, 'rechazada');
                      closeModal();
                    }}
                    variant="danger"
                    size="md"
                    style={[styles.modalButton, styles.rejectModalButton]}
                  />
                </View>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.xl,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.xl,
  },
  welcomeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  welcomeEmoji: {
    fontSize: 28,
    marginRight: SPACING.md,
  },
  welcomeTextContainer: {
    flex: 1,
  },
  welcomeText: {
    ...typography.title,
    color: colors.themes.teacherProposals.text,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: SPACING.xs,
  },
  subtitleText: {
    ...typography.bodySmall,
    color: colors.themes.teacherProposals.textSecondary,
    fontSize: 16,
  },

  // Stats Cards
  statsContainer: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  statCard: {
    flex: 1,
    padding: SPACING.md,
    borderRadius: radii.lg,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  statEmoji: {
    fontSize: 20,
    marginBottom: SPACING.xs,
  },
  statNumber: {
    ...typography.title,
    color: colors.white,
    fontSize: 20,
    fontWeight: '800',
    marginTop: SPACING.xs,
  },
  statLabel: {
    ...typography.caption,
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
    marginTop: SPACING.xs,
  },

  sectionTitle: {
    ...typography.subtitle,
    color: colors.themes.teacherProposals.text,
    fontWeight: '700',
    fontSize: 18,
    marginBottom: SPACING.md,
  },

  // Proposals Section
  proposalsSection: {
    marginBottom: SPACING.xl,
  },
  proposalsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.themes.teacherProposals.card,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.themes.teacherProposals.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
    paddingHorizontal: SPACING.lg,
  },
  emptyStateEmoji: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  emptyStateTitle: {
    ...typography.subtitle,
    color: colors.themes.teacherProposals.text,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  emptyStateText: {
    ...typography.bodySmall,
    color: colors.themes.teacherProposals.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },

  // Proposals List
  proposalsList: {
    gap: SPACING.md,
  },
  proposalCard: {
    backgroundColor: colors.themes.teacherProposals.card,
    padding: SPACING.lg,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  proposalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  avatarText: {
    ...typography.bodySmall,
    color: colors.white,
    fontWeight: '700',
    fontSize: 16,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    ...typography.bodySmall,
    color: colors.themes.teacherProposals.text,
    fontWeight: '700',
    fontSize: 16,
  },
  userContact: {
    ...typography.caption,
    color: colors.themes.teacherProposals.textSecondary,
    fontSize: 12,
    marginTop: SPACING.xs,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: radii.pill,
  },
  statusText: {
    ...typography.caption,
    color: colors.white,
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  proposalMessage: {
    ...typography.bodySmall,
    color: colors.themes.teacherProposals.textSecondary,
    lineHeight: 20,
    marginBottom: SPACING.md,
  },
  proposalActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: radii.md,
    minWidth: 50,
  },
  acceptButton: {
    backgroundColor: colors.success,
  },
  rejectButton: {
    backgroundColor: colors.danger,
  },
  detailsButton: {
    backgroundColor: colors.info,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    maxHeight: '90%',
    minHeight: '70%',
    ...elevation.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral200,
  },
  modalTitle: {
    ...typography.subtitle,
    color: colors.neutral900,
    fontWeight: '700',
    fontSize: 18,
  },
  closeButton: {
    padding: SPACING.sm,
  },
  modalContent: {
    flex: 1,
    padding: SPACING.xl,
  },
  detailSection: {
    marginBottom: SPACING.xl,
  },
  detailCard: {
    backgroundColor: colors.neutral50,
    padding: SPACING.lg,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.neutral200,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  detailInfo: {
    marginLeft: SPACING.md,
    flex: 1,
  },
  detailLabel: {
    ...typography.caption,
    color: colors.neutral600,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  detailValue: {
    ...typography.bodySmall,
    color: colors.neutral900,
    fontSize: 14,
    fontWeight: '500',
  },
  messageText: {
    ...typography.bodySmall,
    color: colors.neutral700,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  observationsText: {
    ...typography.bodySmall,
    color: colors.neutral700,
    lineHeight: 20,
  },
  modalActions: {
    padding: SPACING.xl,
    borderTopWidth: 1,
    borderTopColor: colors.neutral200,
    gap: SPACING.md,
  },
  modalActionButtons: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  modalButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: radii.lg,
    minWidth: 50,
  },
  closeModalButton: {
    backgroundColor: colors.neutral200,
  },
  acceptModalButton: {
    backgroundColor: colors.success,
    flex: 1,
  },
  rejectModalButton: {
    backgroundColor: colors.danger,
    flex: 1,
  },
});
