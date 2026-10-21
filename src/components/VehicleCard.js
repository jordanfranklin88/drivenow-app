import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { getVehicleImage } from '../constants/carImages';

export default function VehicleCard({ vehicle, onPress }) {
  const carImageSource = vehicle.image || getVehicleImage(vehicle);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {}
      <View style={styles.imageContainer}>
        {carImageSource ? (
          <Image
            source={carImageSource}
            style={styles.vehicleImage}
            resizeMode="cover"
          />
        ) : (
          <Text style={styles.emoji}>{vehicle.emoji || '🚗'}</Text>
        )}
        <View style={styles.yearTag}>
          <Text style={styles.yearText}>2026</Text>
        </View>
      </View>

      {}
      <View style={styles.infoContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.name} numberOfLines={1}>
            {vehicle.name}
          </Text>
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={11} color={Colors.warning} />
            <Text style={styles.ratingText}>{vehicle.rating}</Text>
          </View>
        </View>

        <Text style={styles.specs}>
          {vehicle.category} • {vehicle.transmission} • {vehicle.fuel}
        </Text>

        <View style={styles.priceRow}>
          <Text style={styles.priceValue}>R$ {vehicle.price}</Text>
          <Text style={styles.pricePeriod}>/dia</Text>
        </View>
      </View>

      {}
      <View style={styles.arrowContainer}>
        <Ionicons name="chevron-forward" size={18} color={Colors.textSecondary} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  imageContainer: {
    width: 86,
    height: 66,
    borderRadius: 12,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  vehicleImage: {
    width: '100%',
    height: '100%',
  },
  yearTag: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: 'rgba(0, 130, 72, 0.9)',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  yearText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  emoji: {
    fontSize: 32,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    flex: 1,
    marginRight: 6,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    gap: 3,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#92400E',
  },
  specs: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 3,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 5,
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primary,
  },
  pricePeriod: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginLeft: 2,
  },
  arrowContainer: {
    marginLeft: 6,
    padding: 4,
  },
});
