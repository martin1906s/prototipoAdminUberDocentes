import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT_SIZES, FONT_WEIGHTS, SPACING, BORDER_RADIUS, SHADOWS } from '../utils/constants';

const CustomModal = ({ 
  visible, 
  onClose, 
  title, 
  message, 
  buttons = [], 
  type = 'info' // 'info', 'warning', 'error', 'success'
}) => {
  const getIconName = () => {
    switch (type) {
      case 'warning': return 'warning-outline';
      case 'error': return 'close-circle-outline';
      case 'success': return 'checkmark-circle-outline';
      default: return 'information-circle-outline';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'warning': return COLORS.warning;
      case 'error': return COLORS.danger;
      case 'success': return COLORS.success;
      default: return COLORS.info;
    }
  };

  const getGradientColors = () => {
    switch (type) {
      case 'warning': return [COLORS.warning, COLORS.warningDark];
      case 'error': return [COLORS.danger, COLORS.dangerDark];
      case 'success': return [COLORS.success, COLORS.successDark];
      default: return [COLORS.info, COLORS.infoDark];
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <LinearGradient
            colors={[COLORS.white, COLORS.gray[50]]}
            style={styles.modalGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {/* Header */}
            <View style={styles.modalHeader}>
              <View style={styles.iconContainer}>
                <Ionicons name={getIconName()} size={24} color={getIconColor()} />
              </View>
              <Text style={styles.modalTitle}>{title}</Text>
            </View>

            {/* Message */}
            <View style={styles.modalBody}>
              <Text style={styles.modalMessage}>{message}</Text>
            </View>

            {/* Buttons */}
            <View style={styles.modalFooter}>
              {buttons.map((button, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.modalButton,
                    button.style === 'cancel' && styles.cancelButton,
                    button.style === 'destructive' && styles.destructiveButton,
                    button.style === 'default' && styles.defaultButton,
                  ]}
                  onPress={button.onPress}
                >
                  <Text style={[
                    styles.modalButtonText,
                    button.style === 'cancel' && styles.cancelButtonText,
                    button.style === 'destructive' && styles.destructiveButtonText,
                    button.style === 'default' && styles.defaultButtonText,
                  ]}>
                    {button.text}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 400,
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
    ...SHADOWS.xl,
  },
  modalGradient: {
    padding: 0,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING['2xl'],
    paddingBottom: SPACING.lg,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.lg,
  },
  modalTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.gray[800],
    flex: 1,
  },
  modalBody: {
    paddingHorizontal: SPACING['2xl'],
    paddingBottom: SPACING['2xl'],
  },
  modalMessage: {
    fontSize: FONT_SIZES.base,
    color: COLORS.gray[600],
    lineHeight: 22,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: SPACING['2xl'],
    paddingTop: 0,
    gap: SPACING.md,
  },
  modalButton: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    minWidth: 80,
    alignItems: 'center',
    ...(Platform.OS === 'web' && {
      cursor: 'pointer',
      userSelect: 'none',
      transition: 'all 0.2s ease',
    }),
  },
  defaultButton: {
    backgroundColor: COLORS.primary,
  },
  cancelButton: {
    backgroundColor: COLORS.gray[200],
  },
  destructiveButton: {
    backgroundColor: COLORS.danger,
  },
  modalButtonText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  defaultButtonText: {
    color: COLORS.white,
  },
  cancelButtonText: {
    color: COLORS.gray[700],
  },
  destructiveButtonText: {
    color: COLORS.white,
  },
});

export default CustomModal;
