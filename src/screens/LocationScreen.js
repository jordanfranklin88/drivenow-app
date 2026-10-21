import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import * as Network from 'expo-network';
import { Colors } from '../constants/colors';
import { ApiService } from '../services/api';
import styles from './styles/LocationScreen.styles';

export default function LocationScreen({ route, navigation }) {
  const onSelectAgency = route.params?.onSelectAgency;

  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [agenciesWithDistance, setAgenciesWithDistance] = useState([]);
  const [networkType, setNetworkType] = useState('Verificando...');
  const [loading, setLoading] = useState(true);
  const [permissionDenied, setPermissionDenied] = useState(false);

  useEffect(() => {
    checkNetworkAndGetLocation();
  }, []);

  const checkNetworkAndGetLocation = async () => {
    try {
      setLoading(true);

      const networkState = await Network.getNetworkStateAsync();
      if (networkState.type === Network.NetworkStateType.WIFI) {
        setNetworkType('Conectado via Wi-Fi 📶');
      } else if (networkState.type === Network.NetworkStateType.CELLULAR) {
        setNetworkType('Conectado via Dados Móveis (4G/5G) 📱');
      } else {
        setNetworkType('Conectado à Internet 🌐');
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setPermissionDenied(true);
        Alert.alert(
          'Permissão de Localização',
          'A permissão de GPS foi recusada. Usaremos as coordenadas padrão de Maceió para exibir as agências.'
        );
        calculateDistancesForCoordinates(-9.6658, -35.7353);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setLocation(currentLocation.coords);

      const reverse = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      if (reverse && reverse.length > 0) {
        const place = reverse[0];
        setAddress(`${place.street || place.name || 'Localização Atual'}, ${place.subregion || place.city || 'Maceió'} - ${place.region || 'AL'}`);
      }

      calculateDistancesForCoordinates(
        currentLocation.coords.latitude,
        currentLocation.coords.longitude
      );
    } catch (error) {
      console.log('Erro ao obter localização:', error);
      calculateDistancesForCoordinates(-9.6658, -35.7353);
    } finally {
      setLoading(false);
    }
  };

  const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  };

  const calculateDistancesForCoordinates = async (userLat, userLon) => {
    const agencies = await ApiService.getAgencies();
    const list = agencies.map((agency) => {
      const distance = calculateDistanceKm(
        userLat,
        userLon,
        agency.latitude,
        agency.longitude
      );
      return { ...agency, distance: parseFloat(distance) };
    });

    list.sort((a, b) => a.distance - b.distance);
    setAgenciesWithDistance(list);
  };

  const handleSelectAgency = (agency) => {
    if (onSelectAgency) {
      onSelectAgency(agency.name);
    }
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={20} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>GPS & Agências Próximas</Text>
        <View style={{ width: 38 }} />
      </View>

      {}
      <View style={styles.nativeCard}>
        <View style={styles.nativeHeader}>
          <Ionicons name="navigate" size={20} color={Colors.primary} />
          <Text style={styles.nativeTitle}>Recursos Nativos: GPS & Rede</Text>
        </View>

        <View style={styles.networkInfo}>
          <Ionicons name="wifi" size={14} color={Colors.primary} />
          <Text style={styles.networkText}>{networkType}</Text>
        </View>

        <View style={styles.gpsCoordsRow}>
          <Ionicons name="location" size={14} color={Colors.primary} />
          <Text style={styles.gpsCoordsText} numberOfLines={1}>
            {address || (location ? `Lat: ${location.latitude.toFixed(4)}, Lon: ${location.longitude.toFixed(4)}` : 'Calculando coordenadas...')}
          </Text>
        </View>
      </View>

      <Text style={styles.listSectionTitle}>Agências Ordenadas por Proximidade</Text>

      {loading ? (
        <View style={styles.centerLoading}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Calculando distância via GPS...</Text>
        </View>
      ) : (
        <FlatList
          data={agenciesWithDistance}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={[styles.agencyCard, index === 0 && styles.closestCard]}
              onPress={() => handleSelectAgency(item)}
              activeOpacity={0.85}
            >
              <View style={styles.agencyHeader}>
                <View style={{ flex: 1 }}>
                  {index === 0 && (
                    <View style={styles.closestBadge}>
                      <Ionicons name="flash" size={10} color="#065F46" />
                      <Text style={styles.closestBadgeText}>MAIS PRÓXIMA DE VOCÊ</Text>
                    </View>
                  )}
                  <Text style={styles.agencyName}>{item.name}</Text>
                  <Text style={styles.agencyAddress}>{item.address}</Text>
                </View>

                <View style={styles.distanceBadge}>
                  <Text style={styles.distanceNumber}>{item.distance}</Text>
                  <Text style={styles.distanceUnit}>km</Text>
                </View>
              </View>

              <View style={styles.agencyFooter}>
                <View style={styles.agencyInfoRow}>
                  <Ionicons name="time-outline" size={13} color={Colors.textSecondary} />
                  <Text style={styles.agencyInfoText}>{item.hours}</Text>
                </View>

                <View style={styles.agencyInfoRow}>
                  <Ionicons name="call-outline" size={13} color={Colors.textSecondary} />
                  <Text style={styles.agencyInfoText}>{item.phone}</Text>
                </View>
              </View>

              <View style={styles.selectButton}>
                <Text style={styles.selectButtonText}>Selecionar esta Agência</Text>
                <Ionicons name="checkmark" size={14} color={Colors.primary} />
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}
