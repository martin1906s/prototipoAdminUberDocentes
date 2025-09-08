import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Platform
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AppCard from './AppCard';
import AppButton from './AppButton';
import { colors, typography, spacing, radii, elevation } from '../theme/theme';

// Datos de provincias y ciudades de Ecuador
const ecuadorLocations = {
  'Azuay': ['Cuenca', 'Gualaceo', 'Paute', 'Sigsig', 'Girón', 'San Fernando', 'Santa Isabel', 'Pucará', 'Camilo Ponce Enríquez', 'Chordeleg', 'El Pan', 'Sevilla de Oro', 'Oña', 'Ponce Enríquez', 'Pucará', 'Sígsig'],
  'Bolívar': ['Guaranda', 'Chillanes', 'Chimbo', 'Echeandía', 'San Miguel', 'Caluma', 'Las Naves'],
  'Cañar': ['Azogues', 'Biblián', 'Cañar', 'La Troncal', 'El Tambo', 'Déleg', 'Suscal'],
  'Carchi': ['Tulcán', 'Bolívar', 'Espejo', 'Mira', 'Montúfar', 'San Pedro de Huaca'],
  'Chimborazo': ['Riobamba', 'Alausí', 'Colta', 'Chambo', 'Chunchi', 'Guamote', 'Guano', 'Pallatanga', 'Penipe', 'Cumandá'],
  'Cotopaxi': ['Latacunga', 'La Maná', 'Pangua', 'Pujilí', 'Salcedo', 'Saquisilí', 'Sigchos', 'Pujilí', 'Salcedo', 'Saquisilí', 'Sigchos'],
  'El Oro': ['Machala', 'Arenillas', 'Atahualpa', 'Balsas', 'Chilla', 'El Guabo', 'Huaquillas', 'Marcabelí', 'Pasaje', 'Piñas', 'Portovelo', 'Santa Rosa', 'Zaruma'],
  'Esmeraldas': ['Esmeraldas', 'Eloy Alfaro', 'Muisne', 'Quinindé', 'San Lorenzo', 'Atacames', 'Muisne', 'Rioverde', 'San Lorenzo'],
  'Galápagos': ['Puerto Baquerizo Moreno', 'Isabela', 'Santa Cruz'],
  'Guayas': ['Guayaquil', 'Alfredo Baquerizo Moreno', 'Balao', 'Balzar', 'Colimes', 'Daule', 'Durán', 'El Empalme', 'El Triunfo', 'Milagro', 'Naranjal', 'Naranjito', 'Nobol', 'Palestina', 'Pedro Carbo', 'Samborondón', 'Santa Lucía', 'Salitre', 'San Jacinto de Yaguachi', 'Playas', 'Simón Bolívar', 'Yaguachi'],
  'Imbabura': ['Ibarra', 'Antonio Ante', 'Cotacachi', 'Otavalo', 'Pimampiro', 'San Miguel de Urcuquí'],
  'Loja': ['Loja', 'Calvas', 'Catamayo', 'Celica', 'Chaguarpamba', 'Espíndola', 'Gonzanamá', 'Macará', 'Paltas', 'Puyango', 'Quilanga', 'Saraguro', 'Sozoranga', 'Zapotillo', 'Pindal', 'Olmedo', 'Paltas'],
  'Los Ríos': ['Babahoyo', 'Baba', 'Montalvo', 'Puebloviejo', 'Quevedo', 'Urdaneta', 'Ventanas', 'Vínces', 'Palenque', 'Buena Fe', 'Valencia', 'Mocache', 'Quinsaloma'],
  'Manabí': ['Portoviejo', 'Bolívar', 'Chone', 'El Carmen', 'Flavio Alfaro', 'Jipijapa', 'Junín', 'Manta', 'Montecristi', 'Paján', 'Pedernales', 'Pichincha', 'Puerto López', 'Rocafuerte', 'San Vicente', 'Santa Ana', 'Sucre', 'Tosagua', '24 de Mayo'],
  'Morona Santiago': ['Macas', 'Gualaquiza', 'Huamboya', 'Limon Indanza', 'Logroño', 'Pablo Sexto', 'Palora', 'Pablo Sexto', 'Santiago', 'Sucúa', 'Taisha', 'Tiwintza', 'Morona', 'Pablo Sexto'],
  'Napo': ['Tena', 'Archidona', 'El Chaco', 'Quijos', 'Carlos Julio Arosemena Tola'],
  'Orellana': ['Francisco de Orellana', 'Aguarico', 'La Joya de los Sachas', 'Loreto'],
  'Pastaza': ['Puyo', 'Arajuno', 'Mera', 'Santa Clara'],
  'Pichincha': ['Quito', 'Cayambe', 'Mejía', 'Pedro Moncayo', 'Rumiñahui', 'San Miguel de los Bancos', 'Pedro Vicente Maldonado', 'Puerto Quito'],
  'Santa Elena': ['Santa Elena', 'La Libertad', 'Salinas'],
  'Santo Domingo de los Tsáchilas': ['Santo Domingo', 'La Concordia'],
  'Sucumbíos': ['Nueva Loja', 'Cascales', 'Cuyabeno', 'Gonzalo Pizarro', 'Putumayo', 'Shushufindi', 'Sucumbíos'],
  'Tungurahua': ['Ambato', 'Baños de Agua Santa', 'Cevallos', 'Mocha', 'Patate', 'Quero', 'San Pedro de Pelileo', 'Santiago de Píllaro', 'Tisaleo'],
  'Zamora Chinchipe': ['Zamora', 'Chinchipe', 'El Pangui', 'Nangaritza', 'Palanda', 'Pachicutza', 'Yacuambi', 'Yantzaza', 'Zamora']
};

export default function LocationSelector({ 
  selectedProvince, 
  selectedCity, 
  onProvinceSelect, 
  onCitySelect, 
  onLocationSelect,
  style 
}) {
  const [showProvinceModal, setShowProvinceModal] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);
  const [tempProvince, setTempProvince] = useState(selectedProvince);
  const [tempCity, setTempCity] = useState(selectedCity);

  const provinces = Object.keys(ecuadorLocations);
  const cities = tempProvince ? ecuadorLocations[tempProvince] || [] : [];


  // Sincronizar estado interno con props
  useEffect(() => {
    setTempProvince(selectedProvince);
    setTempCity(selectedCity);
  }, [selectedProvince, selectedCity]);

  const handleProvinceSelect = (province) => {
    setTempProvince(province);
    setTempCity(''); // Reset city when province changes
    setShowProvinceModal(false);
  };

  const handleCitySelect = (city) => {
    setTempCity(city);
    setShowCityModal(false);
    // Confirmar automáticamente cuando se selecciona una ciudad
    if (onProvinceSelect) onProvinceSelect(tempProvince);
    if (onCitySelect) onCitySelect(city);
    if (onLocationSelect) onLocationSelect(tempProvince, city);
  };

  const ProvinceModal = () => (
    <Modal
      visible={showProvinceModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowProvinceModal(false)}
    >
      <View style={styles.modalOverlay}>
        <AppCard style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Seleccionar Provincia</Text>
            <TouchableOpacity onPress={() => setShowProvinceModal(false)}>
              <MaterialIcons name="close" size={24} color={colors.neutral500} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.optionsList}>
            {provinces.map((province) => (
              <TouchableOpacity
                key={province}
                style={[
                  styles.optionItem,
                  tempProvince === province && styles.optionItemSelected
                ]}
                onPress={() => handleProvinceSelect(province)}
              >
                <Text style={[
                  styles.optionText,
                  tempProvince === province && styles.optionTextSelected
                ]}>
                  {province}
                </Text>
                {tempProvince === province && (
                  <MaterialIcons name="check" size={20} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </AppCard>
      </View>
    </Modal>
  );

  const CityModal = () => (
    <Modal
      visible={showCityModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowCityModal(false)}
    >
      <View style={styles.modalOverlay}>
        <AppCard style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              Seleccionar Ciudad - {tempProvince}
            </Text>
            <TouchableOpacity onPress={() => setShowCityModal(false)}>
              <MaterialIcons name="close" size={24} color={colors.neutral500} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.optionsList}>
            {cities.map((city) => (
              <TouchableOpacity
                key={city}
                style={[
                  styles.optionItem,
                  tempCity === city && styles.optionItemSelected
                ]}
                onPress={() => handleCitySelect(city)}
              >
                <Text style={[
                  styles.optionText,
                  tempCity === city && styles.optionTextSelected
                ]}>
                  {city}
                </Text>
                {tempCity === city && (
                  <MaterialIcons name="check" size={20} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </AppCard>
      </View>
    </Modal>
  );

  return (
    <View style={[styles.container, style]}>
      {/* Selector de Provincia */}
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setShowProvinceModal(true)}
      >
        <View style={styles.selectorContent}>
          <MaterialIcons name="location-on" size={20} color={colors.primary} />
          <View style={styles.selectorText}>
            <Text style={styles.selectorLabel}>Provincia</Text>
            <Text style={[
              styles.selectorValue,
              !tempProvince && styles.selectorPlaceholder
            ]}>
              {tempProvince || 'Seleccionar provincia'}
            </Text>
          </View>
          <MaterialIcons name="keyboard-arrow-down" size={20} color={colors.neutral500} />
        </View>
      </TouchableOpacity>

      {/* Selector de Ciudad */}
      <TouchableOpacity
        style={[
          styles.selector,
          !tempProvince && styles.selectorDisabled
        ]}
        onPress={() => tempProvince && setShowCityModal(true)}
        disabled={!tempProvince}
      >
        <View style={styles.selectorContent}>
          <MaterialIcons 
            name="location-city" 
            size={20} 
            color={tempProvince ? colors.primary : colors.neutral400} 
          />
          <View style={styles.selectorText}>
            <Text style={styles.selectorLabel}>Ciudad</Text>
            <Text style={[
              styles.selectorValue,
              (!tempCity || !tempProvince) && styles.selectorPlaceholder
            ]}>
              {tempProvince ? (tempCity || 'Seleccionar ciudad') : 'Selecciona cuidad'}
            </Text>
          </View>
          <MaterialIcons 
            name="keyboard-arrow-down" 
            size={20} 
            color={tempProvince ? colors.neutral500 : colors.neutral400} 
          />
        </View>
      </TouchableOpacity>


      <ProvinceModal />
      <CityModal />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  selector: {
    borderWidth: 1,
    borderColor: colors.neutral200,
    borderRadius: radii.pill,
    backgroundColor: colors.white,
    marginBottom: spacing.sm,
    ...elevation.xs,
  },
  selectorDisabled: {
    backgroundColor: colors.neutral100,
    borderColor: colors.neutral300,
  },
  selectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  selectorText: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  selectorLabel: {
    ...typography.caption,
    color: colors.neutral600,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  selectorValue: {
    ...typography.body,
    color: colors.neutral900,
  },
  selectorPlaceholder: {
    color: colors.neutral500,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  modalContent: {
    width: '100%',
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral200,
  },
  modalTitle: {
    ...typography.subtitle,
    color: colors.neutral900,
    fontWeight: '700',
  },
  optionsList: {
    maxHeight: 300,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.sm,
    marginBottom: spacing.xs,
  },
  optionItemSelected: {
    backgroundColor: colors.primary + '10',
  },
  optionText: {
    ...typography.body,
    color: colors.neutral900,
    flex: 1,
  },
  optionTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
});
