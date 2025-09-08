import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Platform
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

export default function SettingsScreen({ navigation }) {
  const { state, actions } = useStore();
  const { modalVisible, modalConfig, showConfirm, hideModal } = useModal();
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      proposals: true,
      reports: false
    },
    system: {
      autoApprove: false,
      maxProposals: 50,
      commissionRate: 15,
      currency: 'USD'
    },
    appearance: {
      theme: 'light',
      language: 'es',
      fontSize: 'medium'
    },
    security: {
      twoFactor: false,
      sessionTimeout: 30,
      requirePassword: true
    }
  });

  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState('');

  const handleToggleSetting = (category, setting) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting]
      }
    }));
  };

  const handleEditSetting = (category, setting, currentValue) => {
    setEditingField(`${category}.${setting}`);
    setTempValue(currentValue.toString());
  };

  const handleSaveSetting = () => {
    if (!editingField) return;
    
    const [category, setting] = editingField.split('.');
    const newValue = isNaN(tempValue) ? tempValue : parseFloat(tempValue);
    
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: newValue
      }
    }));
    
    setEditingField(null);
    setTempValue('');
    Alert.alert('Éxito', 'Configuración actualizada correctamente');
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setTempValue('');
  };

  const handleResetSettings = () => {
    showConfirm(
      'Restablecer Configuración',
      '¿Estás seguro de que quieres restablecer todas las configuraciones a sus valores por defecto?',
      () => {
        setSettings({
          notifications: {
            email: true,
            push: true,
            proposals: true,
            reports: false
          },
          system: {
            autoApprove: false,
            maxProposals: 50,
            commissionRate: 15,
            currency: 'USD'
          },
          appearance: {
            theme: 'light',
            language: 'es',
            fontSize: 'medium'
          },
          security: {
            twoFactor: false,
            sessionTimeout: 30,
            requirePassword: true
          }
        });
        hideModal();
        Alert.alert('Éxito', 'Configuración restablecida correctamente');
      }
    );
  };

  const SettingItem = ({ title, subtitle, value, onPress, type = 'text', onToggle }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingInfo}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      <View style={styles.settingValue}>
        {type === 'switch' ? (
          <Switch
            value={value}
            onValueChange={onToggle}
            trackColor={{ false: colors.neutral300, true: colors.primary }}
            thumbColor={value ? colors.white : colors.neutral500}
          />
        ) : (
          <>
            <Text style={styles.settingValueText}>{value}</Text>
            <MaterialIcons name="chevron-right" size={20} color={colors.neutral400} />
          </>
        )}
      </View>
    </TouchableOpacity>
  );

  const EditableSettingItem = ({ title, subtitle, value, onEdit, onSave, onCancel, isEditing }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingInfo}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      <View style={styles.settingValue}>
        {isEditing ? (
          <View style={styles.editContainer}>
            <AppInput
              value={tempValue}
              onChangeText={setTempValue}
              style={styles.editInput}
              keyboardType="numeric"
            />
            <TouchableOpacity onPress={onSave} style={styles.saveButton}>
              <MaterialIcons name="check" size={16} color={colors.white} />
            </TouchableOpacity>
            <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
              <MaterialIcons name="close" size={16} color={colors.white} />
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.settingValueText}>{value}</Text>
            <TouchableOpacity onPress={onEdit} style={styles.editButton}>
              <MaterialIcons name="edit" size={16} color={colors.primary} />
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );

  const SectionHeader = ({ title, icon }) => (
    <View style={styles.sectionHeader}>
      <MaterialIcons name={icon} size={20} color={colors.primary} />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
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
          <Text style={styles.headerTitle}>Configuración del Sistema</Text>
          <TouchableOpacity style={styles.resetButton} onPress={handleResetSettings}>
            <MaterialIcons name="refresh" size={24} color={colors.white} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {/* Notificaciones */}
          <SectionHeader title="Notificaciones" icon="notifications" />
          <AppCard style={styles.sectionCard}>
            <SettingItem
              title="Notificaciones por Email"
              subtitle="Recibir notificaciones importantes por correo"
              value={settings.notifications.email}
              type="switch"
              onToggle={() => handleToggleSetting('notifications', 'email')}
            />
            <SettingItem
              title="Notificaciones Push"
              subtitle="Recibir notificaciones en tiempo real"
              value={settings.notifications.push}
              type="switch"
              onToggle={() => handleToggleSetting('notifications', 'push')}
            />
            <SettingItem
              title="Nuevas Propuestas"
              subtitle="Notificar cuando lleguen nuevas propuestas"
              value={settings.notifications.proposals}
              type="switch"
              onToggle={() => handleToggleSetting('notifications', 'proposals')}
            />
            <SettingItem
              title="Reportes Semanales"
              subtitle="Recibir reportes de actividad semanal"
              value={settings.notifications.reports}
              type="switch"
              onToggle={() => handleToggleSetting('notifications', 'reports')}
            />
          </AppCard>

          {/* Sistema */}
          <SectionHeader title="Sistema" icon="settings" />
          <AppCard style={styles.sectionCard}>
            <SettingItem
              title="Aprobación Automática"
              subtitle="Aprobar propuestas automáticamente"
              value={settings.system.autoApprove}
              type="switch"
              onToggle={() => handleToggleSetting('system', 'autoApprove')}
            />
            <EditableSettingItem
              title="Máximo de Propuestas"
              subtitle="Límite de propuestas por mes"
              value={settings.system.maxProposals}
              isEditing={editingField === 'system.maxProposals'}
              onEdit={() => handleEditSetting('system', 'maxProposals', settings.system.maxProposals)}
              onSave={handleSaveSetting}
              onCancel={handleCancelEdit}
            />
            <EditableSettingItem
              title="Tasa de Comisión"
              subtitle="Porcentaje de comisión por propuesta"
              value={`${settings.system.commissionRate}%`}
              isEditing={editingField === 'system.commissionRate'}
              onEdit={() => handleEditSetting('system', 'commissionRate', settings.system.commissionRate)}
              onSave={handleSaveSetting}
              onCancel={handleCancelEdit}
            />
            <SettingItem
              title="Moneda"
              subtitle="Moneda principal del sistema"
              value={settings.system.currency}
              onPress={() => Alert.alert('Moneda', 'Selecciona la moneda principal')}
            />
          </AppCard>

          {/* Apariencia */}
          <SectionHeader title="Apariencia" icon="palette" />
          <AppCard style={styles.sectionCard}>
            <SettingItem
              title="Tema"
              subtitle="Tema claro u oscuro"
              value={settings.appearance.theme === 'light' ? 'Claro' : 'Oscuro'}
              onPress={() => Alert.alert('Tema', 'Selecciona el tema de la aplicación')}
            />
            <SettingItem
              title="Idioma"
              subtitle="Idioma de la interfaz"
              value={settings.appearance.language === 'es' ? 'Español' : 'English'}
              onPress={() => Alert.alert('Idioma', 'Selecciona el idioma de la aplicación')}
            />
            <SettingItem
              title="Tamaño de Fuente"
              subtitle="Tamaño del texto en la aplicación"
              value={settings.appearance.fontSize === 'small' ? 'Pequeño' : 
                     settings.appearance.fontSize === 'medium' ? 'Mediano' : 'Grande'}
              onPress={() => Alert.alert('Fuente', 'Selecciona el tamaño de fuente')}
            />
          </AppCard>

          {/* Seguridad */}
          <SectionHeader title="Seguridad" icon="security" />
          <AppCard style={styles.sectionCard}>
            <SettingItem
              title="Autenticación de Dos Factores"
              subtitle="Requerir código adicional para iniciar sesión"
              value={settings.security.twoFactor}
              type="switch"
              onToggle={() => handleToggleSetting('security', 'twoFactor')}
            />
            <EditableSettingItem
              title="Tiempo de Sesión"
              subtitle="Minutos antes de cerrar sesión automáticamente"
              value={`${settings.security.sessionTimeout} min`}
              isEditing={editingField === 'security.sessionTimeout'}
              onEdit={() => handleEditSetting('security', 'sessionTimeout', settings.security.sessionTimeout)}
              onSave={handleSaveSetting}
              onCancel={handleCancelEdit}
            />
            <SettingItem
              title="Requerir Contraseña"
              subtitle="Solicitar contraseña para acciones sensibles"
              value={settings.security.requirePassword}
              type="switch"
              onToggle={() => handleToggleSetting('security', 'requirePassword')}
            />
          </AppCard>

          {/* Acciones del Sistema */}
          <SectionHeader title="Acciones del Sistema" icon="build" />
          <AppCard style={styles.sectionCard}>
            <AppButton
              title="Exportar Datos"
              variant="outline"
              leftIcon="file-download"
              onPress={() => Alert.alert('Exportar', 'Iniciando exportación de datos...')}
              style={styles.actionButton}
            />
            <AppButton
              title="Limpiar Cache"
              variant="outline"
              leftIcon="clear"
              onPress={() => Alert.alert('Cache', 'Cache limpiado correctamente')}
              style={styles.actionButton}
            />
            <AppButton
              title="Respaldar Configuración"
              variant="outline"
              leftIcon="backup"
              onPress={() => Alert.alert('Respaldo', 'Configuración respaldada correctamente')}
              style={styles.actionButton}
            />
          </AppCard>

          {/* Información del Sistema */}
          <SectionHeader title="Información" icon="info" />
          <AppCard style={styles.sectionCard}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Versión de la App</Text>
              <Text style={styles.infoValue}>1.0.0</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Última Actualización</Text>
              <Text style={styles.infoValue}>15 Ene 2024</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Base de Datos</Text>
              <Text style={styles.infoValue}>SQLite Local</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Espacio Usado</Text>
              <Text style={styles.infoValue}>45.2 MB</Text>
            </View>
          </AppCard>
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
  resetButton: {
    padding: spacing.sm,
  },
  content: {
    flex: 1,
    padding: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.subtitle,
    color: colors.neutral900,
    fontWeight: '700',
    marginLeft: spacing.sm,
  },
  sectionCard: {
    marginBottom: spacing.lg,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral100,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    ...typography.body,
    color: colors.neutral900,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  settingSubtitle: {
    ...typography.bodySmall,
    color: colors.neutral600,
  },
  settingValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValueText: {
    ...typography.body,
    color: colors.neutral700,
    marginRight: spacing.sm,
  },
  editContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editInput: {
    width: 80,
    marginRight: spacing.sm,
  },
  editButton: {
    padding: spacing.xs,
    borderRadius: radii.sm,
    backgroundColor: colors.primary,
    marginLeft: spacing.sm,
  },
  saveButton: {
    padding: spacing.xs,
    borderRadius: radii.sm,
    backgroundColor: colors.success,
    marginLeft: spacing.xs,
  },
  cancelButton: {
    padding: spacing.xs,
    borderRadius: radii.sm,
    backgroundColor: colors.danger,
    marginLeft: spacing.xs,
  },
  actionButton: {
    marginBottom: spacing.sm,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral100,
  },
  infoLabel: {
    ...typography.body,
    color: colors.neutral700,
  },
  infoValue: {
    ...typography.body,
    color: colors.neutral900,
    fontWeight: '600',
  },
});
