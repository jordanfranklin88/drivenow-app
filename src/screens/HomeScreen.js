import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import Header from '../components/Header';
import VehicleCard from '../components/VehicleCard';
import DateRangePickerModal from '../components/DateRangePickerModal';
import { ApiService } from '../services/api';
import styles from './styles/HomeScreen.styles';

export default function HomeScreen({ navigation }) {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAgency, setSelectedAgency] = useState('Aeroporto de Maceió');
  const [pickupDate, setPickupDate] = useState('20/10');
  const [returnDate, setReturnDate] = useState('24/10');
  const [pickupTime, setPickupTime] = useState('10:00');
  const [returnTime, setReturnTime] = useState('10:00');
  const [days, setDays] = useState(4);
  const [showDateModal, setShowDateModal] = useState(false);

  useEffect(() => {
    loadPopularVehicles();
  }, []);

  const loadPopularVehicles = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getVehicles('Todos');
      setVehicles(data.slice(0, 3));
    } catch (error) {
      console.log('Erro ao carregar veículos populares:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { label: 'Econômico', emoji: '🚗' },
    { label: 'Compacto', emoji: '🚙' },
    { label: 'SUV', emoji: '🚐' },
    { label: 'Sedan', emoji: '🚘' },
    { label: 'Pickup', emoji: '🛻' },
    { label: 'Luxo', emoji: '🏎️' },
  ];

  const handleCategoryPress = (categoryLabel) => {
    navigation.navigate('Results', {
      initialCategory: categoryLabel,
      agency: selectedAgency,
      pickupDate,
      returnDate,
      pickupTime,
      returnTime,
      days,
    });
  };

  const handleSearchPress = () => {
    navigation.navigate('Results', {
      initialCategory: 'Todos',
      agency: selectedAgency,
      pickupDate,
      returnDate,
      pickupTime,
      returnTime,
      days,
    });
  };

  const handleDateConfirm = (data) => {
    setPickupDate(data.pickupDateShort);
    setReturnDate(data.returnDateShort);
    setPickupTime(data.pickupTime);
    setReturnTime(data.returnTime);
    setDays(data.days);
  };

  const handleOpenGps = () => {
    navigation.navigate('Location', {
      onSelectAgency: (agencyName) => setSelectedAgency(agencyName),
    });
  };

  return (
    <View style={styles.container}>
      {}
      <Header
        userName="JF Souza"
        onLocationPress={handleOpenGps}
        onProfilePress={() => navigation.navigate('Profile')}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {}
        <View style={styles.searchCard}>
          {}
          <TouchableOpacity
            style={styles.locationSelector}
            onPress={handleOpenGps}
            activeOpacity={0.8}
          >
            <View style={styles.iconCircle}>
              <Ionicons name="location" size={18} color={Colors.primary} />
            </View>
            <View style={styles.selectorTexts}>
              <Text style={styles.selectorLabel}>Local de Retirada</Text>
              <Text style={styles.selectorValue} numberOfLines={1}>
                {selectedAgency}
              </Text>
            </View>
            <View style={styles.gpsBadge}>
              <Ionicons name="navigate-outline" size={12} color={Colors.primary} />
              <Text style={styles.gpsBadgeText}>GPS</Text>
            </View>
          </TouchableOpacity>

          {/* Seletores de Datas e Diárias */}
          <View style={styles.datesRow}>
            <TouchableOpacity
              style={styles.dateSelector}
              onPress={() => setShowDateModal(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="calendar" size={18} color={Colors.primary} />
              <View>
                <Text style={styles.selectorLabel}>Retirada</Text>
                <Text style={styles.dateValue}>{pickupDate} às {pickupTime}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dateSelector}
              onPress={() => setShowDateModal(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="calendar-outline" size={18} color={Colors.primary} />
              <View>
                <Text style={styles.selectorLabel}>Devolução</Text>
                <Text style={styles.dateValue}>{returnDate} às {returnTime}</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Atalho de Diárias Interativo */}
          <TouchableOpacity
            style={styles.durationRow}
            onPress={() => setShowDateModal(true)}
            activeOpacity={0.8}
          >
            <View style={styles.durationLeft}>
              <Ionicons name="time" size={15} color={Colors.primary} />
              <Text style={styles.durationText}>
                {days} {days === 1 ? 'diária selecionada' : 'diárias selecionadas'}
              </Text>
            </View>
            <Text style={styles.durationChangeText}>Alterar datas ➔</Text>
          </TouchableOpacity>

          {/* Botão de Busca */}
          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleSearchPress}
            activeOpacity={0.9}
          >
            <Ionicons name="search" size={18} color={Colors.textOnPrimary} />
            <Text style={styles.searchButtonText}>Buscar Carros Disponíveis</Text>
          </TouchableOpacity>
        </View>

        {}
        <View style={styles.promoBanner}>
          <View style={styles.promoContent}>
            <Text style={styles.promoTag}>OFERTA DA SEMANA</Text>
            <Text style={styles.promoTitle}>20% OFF em SUVs</Text>
            <Text style={styles.promoSubtitle}>
              Válido para retiradas até 31 de outubro com km livre.
            </Text>
          </View>
          <Text style={styles.promoEmoji}>✨</Text>
        </View>

        {}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categorias</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Results')}>
            <Text style={styles.sectionLink}>Ver todas</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.categoriesGrid}>
          {categories.map((c) => (
            <TouchableOpacity
              key={c.label}
              style={styles.categoryCard}
              onPress={() => handleCategoryPress(c.label)}
              activeOpacity={0.8}
            >
              <Text style={styles.categoryEmoji}>{c.emoji}</Text>
              <Text style={styles.categoryLabel}>{c.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {}
        <View style={[styles.sectionHeader, { marginTop: 24 }]}>
          <Text style={styles.sectionTitle}>Populares perto de você</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Results')}>
            <Text style={styles.sectionLink}>Ver todos</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="small" color={Colors.primary} style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={vehicles}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <VehicleCard
                vehicle={item}
                onPress={() =>
                  navigation.navigate('Detail', {
                    vehicle: item,
                    agency: selectedAgency,
                    pickupDate,
                    returnDate,
                    pickupTime,
                    returnTime,
                    days,
                  })
                }
              />
            )}
          />
        )}
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
