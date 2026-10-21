import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import VehicleCarousel from '../components/VehicleCarousel';
import DateRangePickerModal from '../components/DateRangePickerModal';
import { addDays, formatDayMonth, parseDateString } from '../utils/dateUtils';
import styles from './styles/DetailScreen.styles';

export default function DetailScreen({ route, navigation }) {
  const {
    vehicle,
    agency = 'Aeroporto de Maceió',
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

  const totalPrice = vehicle.price * days;

  const handleDecreaseDays = () => {
    if (days <= 1) return;
    const newDays = days - 1;
    setDays(newDays);
    const pDate = parseDateString(pickupDate);
    const newReturn = addDays(pDate, newDays);
    setReturnDate(formatDayMonth(newReturn));
  };

  const handleIncreaseDays = () => {
    const newDays = days + 1;
    setDays(newDays);
    const pDate = parseDateString(pickupDate);
    const newReturn = addDays(pDate, newDays);
    setReturnDate(formatDayMonth(newReturn));
  };

  const handleDateConfirm = (data) => {
    setPickupDate(data.pickupDateShort);
    setReturnDate(data.returnDateShort);
    setPickupTime(data.pickupTime);
    setReturnTime(data.returnTime);
    setDays(data.days);
  };

  const specs = [
    { icon: 'people-outline', label: `${vehicle.seats} pessoas` },
    { icon: 'settings-outline', label: vehicle.transmission },
    { icon: 'speedometer-outline', label: vehicle.fuel },
    { icon: 'briefcase-outline', label: vehicle.luggage || '2 malas' },
    { icon: 'snow-outline', label: 'Ar-condicionado' },
    { icon: 'shield-checkmark-outline', label: 'Airbag duplo' },
  ];

  const includedBenefits = [
    'Quilometragem livre e ilimitada',
    'Proteção básica contra colisão e roubo (CDW)',
    'Cancelamento grátis até 24h antes da retirada',
    'Assistência 24 horas em todo o Brasil',
    'Sem taxa surpresa no balcão da agência',
  ];

  const handleGoToBooking = () => {
    navigation.navigate('Booking', {
      vehicle,
      agency,
      pickupDate,
      returnDate,
      pickupTime,
      returnTime,
      days,
    });
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
        <Text style={styles.topBarTitle} numberOfLines={1}>
          {vehicle.name}
        </Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {}
        <VehicleCarousel vehicle={vehicle} />

        {}
        <View style={styles.titleSection}>
          <View style={{ flex: 1 }}>
            <Text style={styles.carName}>{vehicle.name}</Text>
            <Text style={styles.carCategory}>
              Categoria {vehicle.category} • ou modelo similar
            </Text>
          </View>

          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={14} color={Colors.warning} />
            <Text style={styles.ratingScore}>{vehicle.rating}</Text>
            <Text style={styles.ratingCount}>({vehicle.reviews || 120})</Text>
          </View>
        </View>

        {}
        {vehicle.description && (
          <Text style={styles.description}>{vehicle.description}</Text>
        )}

        {}
        <Text style={styles.sectionHeader}>Especificações do veículo</Text>
        <View style={styles.specsGrid}>
          {specs.map((item, index) => (
            <View key={index} style={styles.specItem}>
              <Ionicons name={item.icon} size={20} color={Colors.primary} />
              <Text style={styles.specLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        {}
        <View style={styles.includedCard}>
          <Text style={styles.includedTitle}>Incluso na sua reserva</Text>
          <View style={styles.benefitsList}>
            {includedBenefits.map((benefit, idx) => (
              <View key={idx} style={styles.benefitRow}>
                <Ionicons name="checkmark-circle" size={18} color={Colors.primary} />
                <Text style={styles.benefitText}>{benefit}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Local de Retirada */}
        <View style={styles.pickupCard}>
          <View style={styles.pickupRow}>
            <Ionicons name="location-outline" size={18} color={Colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.pickupLabel}>Local de retirada e devolução</Text>
              <Text style={styles.pickupValue}>{agency}</Text>
            </View>
          </View>
        </View>

        {/* Card Interativo de Período e Diárias */}
        <View style={styles.rentalPeriodCard}>
          <View style={styles.rentalPeriodHeader}>
            <View style={styles.rentalPeriodTitleRow}>
              <Ionicons name="calendar" size={18} color={Colors.primary} />
              <Text style={styles.rentalPeriodTitle}>Período da Locação</Text>
            </View>
            <TouchableOpacity
              style={styles.changeDatesButton}
              onPress={() => setShowDateModal(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="create-outline" size={14} color={Colors.primary} />
              <Text style={styles.changeDatesText}>Alterar datas</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.rentalDatesGrid}>
            <View style={styles.rentalDateCol}>
              <Text style={styles.rentalDateLabel}>RETIRADA</Text>
              <Text style={styles.rentalDateValue}>{pickupDate}/2026 • {pickupTime}</Text>
            </View>
            <View style={styles.rentalDateArrow}>
              <Ionicons name="arrow-forward" size={16} color={Colors.textLight} />
            </View>
            <View style={styles.rentalDateCol}>
              <Text style={styles.rentalDateLabel}>DEVOLUÇÃO</Text>
              <Text style={styles.rentalDateValue}>{returnDate}/2026 • {returnTime}</Text>
            </View>
          </View>

          {/* Stepper Rápido de Diárias */}
          <View style={styles.rentalDaysStepperRow}>
            <View style={styles.rentalDaysLeft}>
              <Text style={styles.rentalDaysLabel}>Duração do Aluguel</Text>
              <Text style={styles.rentalDaysCount}>
                {days} {days === 1 ? 'diária' : 'diárias'} (R$ {vehicle.price}/dia)
              </Text>
            </View>

            <View style={styles.stepperControls}>
              <TouchableOpacity
                style={[styles.stepperMiniBtn, days <= 1 && styles.stepperMiniBtnDisabled]}
                onPress={handleDecreaseDays}
                disabled={days <= 1}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="remove"
                  size={18}
                  color={days <= 1 ? Colors.textLight : Colors.textPrimary}
                />
              </TouchableOpacity>

              <Text style={styles.stepperMiniText}>{days}</Text>

              <TouchableOpacity
                style={styles.stepperMiniBtn}
                onPress={handleIncreaseDays}
                activeOpacity={0.7}
              >
                <Ionicons name="add" size={18} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Barra Inferior */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.periodText}>{days} {days === 1 ? 'diária' : 'diárias'}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.totalValue}>R$ {totalPrice}</Text>
            <Text style={styles.periodLabel}> total</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.bookButton}
          onPress={handleGoToBooking}
          activeOpacity={0.9}
        >
          <Text style={styles.bookButtonText}>Continuar</Text>
          <Ionicons name="arrow-forward" size={16} color={Colors.textOnPrimary} />
        </TouchableOpacity>
      </View>

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
