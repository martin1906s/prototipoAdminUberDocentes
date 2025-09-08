import React from 'react';
import { View } from 'react-native';
import WebCompatibleBlurView from './WebCompatibleBlurView';
import { radii, spacing } from '../theme/theme';

export default function GlassCard({ children, style, intensity = 30 }) {
  return (
    <View style={{ borderRadius: radii.xl, overflow: 'hidden', marginBottom: spacing.md }}>
      <WebCompatibleBlurView intensity={intensity} tint="light" style={{ padding: spacing.lg }}>
        {children}
      </WebCompatibleBlurView>
    </View>
  );
}
