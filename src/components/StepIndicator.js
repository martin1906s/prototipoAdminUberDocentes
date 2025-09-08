import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, radii, typography, overlay } from '../theme/theme';

export default function StepIndicator({ steps, currentStep, style }) {
  return (
    <View style={[styles.container, style]}>
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;
        
        return (
          <View key={index} style={styles.stepContainer}>
            <View style={[
              styles.stepCircle,
              isActive && styles.stepCircleActive,
              isCompleted && styles.stepCircleCompleted
            ]}>
              {isCompleted ? (
                <MaterialIcons name="check" size={16} color={colors.white} />
              ) : (
                <MaterialIcons 
                  name={step.icon} 
                  size={16} 
                  color={isActive ? colors.white : overlay.textOnDarkTertiary} 
                />
              )}
            </View>
            <Text style={[
              styles.stepTitle,
              isActive && styles.stepTitleActive,
              isCompleted && styles.stepTitleCompleted
            ]}>
              {step.title}
            </Text>
            {index < steps.length - 1 && (
              <View style={[
                styles.connector,
                isCompleted && styles.connectorCompleted
              ]} />
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  stepContainer: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
    paddingHorizontal: spacing.xs,
  },
  stepCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: overlay.surfaceDark,
    borderWidth: 2,
    borderColor: overlay.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  stepCircleActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
  },
  stepCircleCompleted: {
    backgroundColor: colors.success,
    borderColor: colors.success,
    shadowColor: colors.success,
    shadowOpacity: 0.3,
  },
  stepTitle: {
    ...typography.caption,
    color: overlay.textOnDarkTertiary,
    textAlign: 'center',
    fontSize: 9,
    fontWeight: '500',
    lineHeight: 12,
    maxWidth: 60,
  },
  stepTitleActive: {
    color: overlay.textOnDarkPrimary,
    fontWeight: '700',
    fontSize: 10,
  },
  stepTitleCompleted: {
    color: overlay.textOnDarkSecondary,
    fontWeight: '600',
    fontSize: 9,
  },
  connector: {
    position: 'absolute',
    top: 18,
    left: '60%',
    right: '-60%',
    height: 2,
    backgroundColor: overlay.surfaceDark,
    zIndex: -1,
  },
  connectorCompleted: {
    backgroundColor: colors.success,
  },
});