import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Animated, Dimensions, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, typography, radii, elevation } from '../theme/theme';
import { useStore } from '../store/store';

const { width } = Dimensions.get('window');

export default function OptionsMenu({ navigation, theme = 'userSearch' }) {
  const { state, actions } = useStore();
  const [showMenu, setShowMenu] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const openMenu = () => {
    setShowMenu(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: Platform.OS !== 'web',
    }).start(() => {
      setShowMenu(false);
    });
  };

  const handleExit = () => {
    setShowMenu(false);
    
    // Limpiar datos del docente si el rol actual es docente
    if (state.currentRole === 'docente') {
      actions.clearTeacherData();
    }
    
    // Usar setTimeout para evitar el error de useInsertionEffect
    setTimeout(() => {
      navigation.reset({ index: 0, routes: [{ name: 'AdminDashboard' }] });
    }, 100);
  };

  const getThemeColors = () => {
    switch (theme) {
      case 'userSearch':
        return colors.themes.userSearch;
      case 'userProfile':
        return colors.themes.userProfile;
      case 'teacherSetup':
        return colors.themes.teacherSetup;
      case 'teacherProposals':
        return colors.themes.teacherProposals;
      case 'adminDashboard':
        return colors.themes.adminDashboard;
      default:
        return colors.themes.userSearch;
    }
  };

  const themeColors = getThemeColors();

  return (
    <>
      <TouchableOpacity 
        onPress={openMenu}
        style={[styles.menuButton, { borderColor: themeColors.primary }]}
      >
        <MaterialIcons name="more-vert" size={20} color={themeColors.primary} />
      </TouchableOpacity>

      <Modal
        visible={showMenu}
        transparent={true}
        animationType="none"
        onRequestClose={closeMenu}
      >
        <TouchableOpacity 
          style={styles.overlay} 
          activeOpacity={1} 
          onPress={closeMenu}
        >
          <Animated.View 
            style={[
              styles.menuContainer,
              { 
                opacity: fadeAnim,
                transform: [{
                  scale: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1],
                  })
                }]
              }
            ]}
          >
            <View style={[styles.menuHeader, { backgroundColor: themeColors.card }]}>
              <Text style={[styles.menuTitle, { color: themeColors.text }]}>Opciones</Text>
              <TouchableOpacity onPress={closeMenu} style={styles.closeButton}>
                <MaterialIcons name="close" size={20} color={themeColors.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.menuContent}>
              <TouchableOpacity 
                style={[styles.menuItem, { borderBottomColor: themeColors.card }]}
                onPress={handleExit}
              >
                <View style={styles.menuItemContent}>
                  <MaterialIcons name="exit-to-app" size={24} color={colors.danger} />
                  <Text style={[styles.menuItemText, { color: colors.danger }]}>Cerrar sesión</Text>
                </View>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    width: width * 0.8,
    maxWidth: 300,
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    overflow: 'hidden',
    // Web-compatible shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral200,
  },
  menuTitle: {
    ...typography.subtitle,
    fontSize: 18,
    fontWeight: '700',
  },
  closeButton: {
    padding: spacing.xs,
  },
  menuContent: {
    padding: spacing.sm,
  },
  menuItem: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    minHeight: 56,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  menuItemText: {
    ...typography.body,
    fontWeight: '600',
    fontSize: 16,
  },
});
