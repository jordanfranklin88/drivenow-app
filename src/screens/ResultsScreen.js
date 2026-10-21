import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { CATEGORIES } from '../data/vehicles';
import CategoryPill from '../components/CategoryPill';
import VehicleCard from '../components/VehicleCard';
import DateRangePickerModal from '../components/DateRangePickerModal';
import { ApiService } from '../services/api';
import styles from './styles/ResultsScreen.styles';

export default function ResultsScreen({ route, navigation }) {
  const initialCategory = route.params?.initialCategory || 'Todos';
  const initialAgency = route.params?.agency || 'Aeroporto de Maceió';
  const initialPickup = route.params?.pickupDate || '20/10';
  const initialReturn = route.params?.returnDate || '24/10';
  const initialPickupTime = route.params?.pickupTime || '10:00';
  const initialReturnTime = route.params?.returnTime || '10:00';
  const initialDays = route.params?.days || 4;

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [agency, setAgency] = useState(initialAgency);
  const [pickupDate, setPickupDate] = useState(initialPickup);
  const [returnDate, setReturnDate] = useState(initialReturn);
  const [pickupTime, setPickupTime] = useState(initialPickupTime);
  const [returnTime, setReturnTime] = useState(initialReturnTime);
  const [days, setDays] = useState(initialDays);
  const [showDateModal, setShowDateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchVehicles();
  }, [selectedCategory]);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getVehicles(selectedCategory);
      setVehicles(data);
    } catch (error) {
      console.log('Erro ao buscar veículos:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchVehicles();
    setRefreshing(false);
  };

  const handleDateConfirm = (data) => {
    setPickupDate(data.pickupDateShort);
    setReturnDate(data.returnDateShort);
    setPickupTime(data.pickupTime);
    setReturnTime(data.returnTime);
    setDays(data.days);
  };

  const filteredVehicles = vehicles.filter((v) =>
    v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Barra Superior */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={20} color={Colors.textPrimary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.headerInfo}
          onPress={() => setShowDateModal(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.headerTitle}>Carros Disponíveis</Text>
          <Text style={styles.headerSubtitle} numberOfLines={1}>
            {agency} • {pickupDate} ({pickupTime})–{returnDate} ({returnTime}) • {days} {days === 1 ? 'diária' : 'diárias'} ✎
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.gpsShortcut}
          onPress={() => navigation.navigate('Location')}
          activeOpacity={0.8}
        >
          <Ionicons name="navigate-circle-outline" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color={Colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar modelo (ex: Mobi, Renegade, Corolla)..."
          placeholderTextColor={Colors.textLight}
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={18} color={Colors.textLight} />
          </TouchableOpacity>
        )}
      </View>

      {}
      <View style={styles.categoriesContainer}>
        <FlatList
          data={CATEGORIES}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.categoriesList}
          renderItem={({ item }) => (
            <CategoryPill
              category={item}
              isSelected={selectedCategory === item}
              onSelect={setSelectedCategory}
            />
          )}
        />
      </View>

      {}
      <View style={styles.counterRow}>
        <Text style={styles.counterText}>
          {filteredVehicles.length} {filteredVehicles.length === 1 ? 'veículo encontrado' : 'veículos encontrados'}
        </Text>
      </View>

      {}
      {loading && !refreshing ? (
        <View style={styles.centerLoading}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Buscando os melhores carros...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredVehicles}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.vehiclesList}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[Colors.primary]}
              tintColor={Colors.primary}
            />
          }
          renderItem={({ item }) => (
            <VehicleCard
              vehicle={item}
              onPress={() =>
                navigation.navigate('Detail', {
                  vehicle: item,
                  agency,
                  pickupDate,
                  returnDate,
                  pickupTime,
                  returnTime,
                  days,
                })
              }
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>🔍</Text>
              <Text style={styles.emptyTitle}>Nenhum carro encontrado</Text>
              <Text style={styles.emptySubtitle}>
                Tente selecionar outra categoria ou limpar a busca.
              </Text>
              <TouchableOpacity
                style={styles.resetButton}
                onPress={() => {
                  setSelectedCategory('Todos');
                  setSearchQuery('');
                }}
              >
                <Text style={styles.resetButtonText}>Ver todos os carros</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}

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
