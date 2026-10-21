import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { ApiService } from '../services/api';
import { getVehicleImage } from '../constants/carImages';
import DateRangePickerModal from '../components/DateRangePickerModal';
import styles from './styles/BookingScreen.styles';

export default function BookingScreen({ route, navigation }) {
  const {
    vehicle,
    agency,
    pickupDate: initialPickup = '20/10',
    returnDate: initialReturn = '24/10',
    pickupTime: initialPickupTime = '10:00',
    returnTime: initialReturnTime = '10:00',
    days: initialDays = 4,
  } = route.params;

  const [days, setDays] = useState(initialDays);
  const [pickupDate, setPickupDate] = useState(initialPickup);
  const [returnDate, setReturnDate] = useState(initialReturn);
  const [pickupTime, setPickupTime] = useState(initialPickupTime);
  const [returnTime, setReturnTime] = useState(initialReturnTime);
  const [showDateModal, setShowDateModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');

  const dailyTotal = vehicle.price * days;
  const taxes = 42;
  const grandTotal = dailyTotal + taxes;
  const carImageSource = vehicle.image || getVehicleImage(vehicle);

  const handleDateConfirm = (data) => {
    setPickupDate(data.pickupDateShort);
    setReturnDate(data.returnDateShort);
    setPickupTime(data.pickupTime);
    setReturnTime(data.returnTime);
    setDays(data.days);
  };

  const handleConfirmBooking = async () => {
    try {
      setLoading(true);

      const newReservation = await ApiService.createReservation({
        carName: vehicle.name,
        category: vehicle.category,
        emoji: vehicle.emoji,
        image: carImageSource,
        agency,
        pickupDate: `${pickupDate}/2026 às ${pickupTime}`,
        returnDate: `${returnDate}/2026 às ${returnTime}`,
        days,
        dailyRate: vehicle.price,
      });

      navigation.replace('Success', { reservation: newReservation });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível confirmar sua reserva. Tente novamente.');
      console.log('Erro ao reservar:', error);
    } finally {
      setLoading(false);
    }
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
        <Text style={styles.topBarTitle}>Confirmar Reserva</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {}
        <View style={styles.carSummaryCard}>
          <View style={styles.carImageContainer}>
            {carImageSource ? (
              <Image
                source={carImageSource}
                style={styles.carImage}
                resizeMode="cover"
              />
            ) : (
              <Text style={styles.carEmoji}>{vehicle.emoji}</Text>
            )}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.carName}>{vehicle.name}</Text>
            <Text style={styles.carCategory}>
              Categoria {vehicle.category} • {vehicle.transmission}
            </Text>
            <Text style={styles.carRate}>R$ {vehicle.price}/dia</Text>
          </View>
        </View>

        {/* Detalhes do Aluguel */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitleInRow}>Detalhes do Aluguel</Text>
          <TouchableOpacity
            style={styles.sectionEditBtn}
            onPress={() => setShowDateModal(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="create-outline" size={13} color={Colors.primary} />
            <Text style={styles.sectionEditBtnText}>Alterar Período</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="location" size={20} color={Colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.infoLabel}>Local de retirada e devolução</Text>
              <Text style={styles.infoValue}>{agency}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Ionicons name="calendar" size={20} color={Colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.infoLabel}>Data de retirada</Text>
              <Text style={styles.infoValue}>{pickupDate}/2026 • {pickupTime}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={20} color={Colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.infoLabel}>Data de devolução</Text>
              <Text style={styles.infoValue}>{returnDate}/2026 • {returnTime}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={20} color={Colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.infoLabel}>Duração do Aluguel</Text>
              <Text style={styles.infoValue}>
                {days} {days === 1 ? 'diária' : 'diárias'}
              </Text>
            </View>
          </View>
        </View>

        {}
        <Text style={styles.sectionTitle}>Forma de Pagamento</Text>
        <View style={styles.infoCard}>
          <TouchableOpacity
            style={[styles.paymentOption, paymentMethod === 'credit_card' && styles.paymentOptionSelected]}
            onPress={() => setPaymentMethod('credit_card')}
          >
            <Ionicons name="card" size={20} color={Colors.primary} />
            <Text style={styles.paymentText}>Cartão de Crédito (até 6x sem juros)</Text>
            {paymentMethod === 'credit_card' && (
              <Ionicons name="checkmark-circle" size={18} color={Colors.primary} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.paymentOption, paymentMethod === 'pix' && styles.paymentOptionSelected, { marginTop: 8 }]}
            onPress={() => setPaymentMethod('pix')}
          >
            <Ionicons name="flash" size={20} color="#06B6D4" />
            <Text style={styles.paymentText}>PIX Instantâneo (Aprovação na hora)</Text>
            {paymentMethod === 'pix' && (
              <Ionicons name="checkmark-circle" size={18} color={Colors.primary} />
            )}
          </TouchableOpacity>
        </View>

        {}
        <Text style={styles.sectionTitle}>Resumo dos Valores</Text>
        <View style={styles.priceBreakdownCard}>
          <View style={styles.priceLine}>
            <Text style={styles.priceLineLabel}>Diária x {days}</Text>
            <Text style={styles.priceLineValue}>R$ {dailyTotal}</Text>
          </View>

          <View style={styles.priceLine}>
            <Text style={styles.priceLineLabel}>Taxas e Proteção Básica</Text>
            <Text style={styles.priceLineValue}>R$ {taxes}</Text>
          </View>

          <View style={styles.priceLine}>
            <Text style={styles.priceLineLabel}>Quilometragem Livre</Text>
            <Text style={[styles.priceLineValue, { color: Colors.primary }]}>Grátis</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalLine}>
            <Text style={styles.grandTotalLabel}>Total a pagar</Text>
            <Text style={styles.grandTotalValue}>R$ {grandTotal}</Text>
          </View>
        </View>

        {}
        <TouchableOpacity
          style={[styles.payButton, loading && styles.payButtonDisabled]}
          onPress={handleConfirmBooking}
          disabled={loading}
          activeOpacity={0.9}
        >
          {loading ? (
            <ActivityIndicator size="small" color={Colors.textOnPrimary} />
          ) : (
            <>
              <Ionicons name="lock-closed" size={16} color={Colors.textOnPrimary} />
              <Text style={styles.payButtonText}>Confirmar e Pagar R$ {grandTotal}</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Modal de Escolha de Diárias e Datas */}
      <DateRangePickerModal
        visible={showDateModal}
        onClose={() => setShowDateModal(false)}
        initialPickupDate={pickupDate}
        initialReturnDate={returnDate}
        initialPickupTime={pickupTime}
        initialReturnTime={returnTime}
        initialDays={days}
        onConfirm={handleDateConfirm}
      />
    </View>
  );
}
