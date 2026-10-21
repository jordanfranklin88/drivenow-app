import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { ApiService } from '../services/api';
import { getVehicleImage } from '../constants/carImages';
import styles from './styles/ReservationsScreen.styles';

export default function ReservationsScreen({ navigation }) {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getReservations();
      setReservations(data);
    } catch (error) {
      console.log('Erro ao carregar reservas:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadReservations();
    setRefreshing(false);
  };

  const handleCancelReservation = (reservation) => {
    Alert.alert(
      'Cancelar Reserva',
      `Deseja realmente cancelar a reserva ${reservation.code} do ${reservation.carName}?`,
      [
        { text: 'Não', style: 'cancel' },
        {
          text: 'Sim, Cancelar',
          style: 'destructive',
          onPress: async () => {
            try {
              await ApiService.cancelReservation(reservation.id);
              Alert.alert('Reserva Cancelada', 'Sua reserva foi cancelada com sucesso sem nenhum custo.');
              loadReservations();
            } catch (err) {
              Alert.alert('Erro', 'Não foi possível cancelar a reserva.');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Minhas Reservas</Text>
        <Text style={styles.headerSubtitle}>Acompanhe seus aluguéis em andamento</Text>
      </View>

      {loading && !refreshing ? (
        <View style={styles.centerLoading}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={reservations}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[Colors.primary]}
              tintColor={Colors.primary}
            />
          }
          renderItem={({ item }) => {
            const carImg = item.image || getVehicleImage(item);
            return (
              <View style={styles.card}>
                {}
                <View style={styles.cardHeader}>
                  <View style={styles.carImageBox}>
                    {carImg ? (
                      <Image source={carImg} style={styles.cardCarImage} resizeMode="cover" />
                    ) : (
                      <Text style={styles.cardEmoji}>{item.emoji || '🚗'}</Text>
                    )}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.carName}>{item.carName}</Text>
                    <Text style={styles.codeText}>Código: {item.code}</Text>
                  </View>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>{item.status}</Text>
                  </View>
                </View>

              {}
              <View style={styles.detailsBox}>
                <View style={styles.detailRow}>
                  <Ionicons name="location-outline" size={16} color={Colors.primary} />
                  <Text style={styles.detailText} numberOfLines={1}>
                    {item.agency}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Ionicons name="calendar-outline" size={16} color={Colors.primary} />
                  <Text style={styles.detailText}>
                    {item.pickupDate} → {item.returnDate}
                  </Text>
                </View>
              </View>

              {}
              {item.inspected && (
                <View style={styles.inspectedNotice}>
                  <Ionicons name="checkmark-done-circle" size={16} color={Colors.success} />
                  <Text style={styles.inspectedNoticeText}>
                    Vistoria com foto já realizada!
                  </Text>
                </View>
              )}

              {}
              <View style={styles.cardFooter}>
                <View>
                  <Text style={styles.totalLabel}>Valor total</Text>
                  <Text style={styles.totalValue}>R$ {item.total}</Text>
                </View>

                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => handleCancelReservation(item)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.inspectionButton}
                    onPress={() => navigation.navigate('Inspection', { reservation: item })}
                    activeOpacity={0.85}
                  >
                    <Ionicons name="camera-outline" size={14} color={Colors.textOnPrimary} />
                    <Text style={styles.inspectionButtonText}>Vistoria</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>📋</Text>
              <Text style={styles.emptyTitle}>Nenhuma reserva ativa</Text>
              <Text style={styles.emptySubtitle}>
                Quando você reservar um carro, ele aparecerá aqui com todos os detalhes.
              </Text>
              <TouchableOpacity
                style={styles.newBookingButton}
                onPress={() => navigation.navigate('Home')}
              >
                <Text style={styles.newBookingButtonText}>Reservar um carro agora</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </View>
  );
}
