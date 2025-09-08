import React from 'react';
import { View, TouchableOpacity, Text, ScrollView } from 'react-native';
import { colors, radii, spacing, overlay } from '../theme/theme';

export function Chip({ label, selected, onPress, style }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.sm,
        borderRadius: radii.pill,
        backgroundColor: selected ? colors.primary : 'transparent',
        marginRight: spacing.sm,
        borderWidth: 1,
        borderColor: selected ? colors.primary : overlay.glassBorder,
        alignItems: 'center',
        minWidth: 80,
        maxWidth: 100,
        ...style,
      }}
    >
      <Text 
        style={{ 
          color: selected ? colors.white : overlay.textOnDarkPrimary, 
          fontWeight: selected ? '600' : '500',
          fontSize: 13,
          textAlign: 'center',
        }}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export function ChipGroup({ options, value, onChange, style }) {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      contentContainerStyle={{ 
        paddingVertical: spacing.xs,
        paddingRight: spacing.md,
        ...style 
      }}
    >
      {options.map((opt) => (
        <Chip key={opt} label={opt} selected={value === opt} onPress={() => onChange(opt)} />
      ))}
    </ScrollView>
  );
}