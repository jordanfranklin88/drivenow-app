import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { ApiService } from '../services/api';
import { getVehicleImage } from '../constants/carImages';
import styles from './styles/HistoryScreen.styles';

export default function HistoryScreen({ navigation }) {
  const [historyData, setHistoryData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getHistory();
      setHistoryData(data);
    } catch (error) {
      console.log('Erro ao carregar histórico:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRentAgain = (pastRental) => {
    navigation.navigate('Results', { initialCategory: 'Todos' });
  };

  return (
    <View style={styles.container}>
      {}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Histórico</Text>
        <Text style={styles.headerSubtitle}>Suas viagens e estatísticas no DriveNow</Text>
      </View>

      {loading ? (
        <View style={styles.centerLoading}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={historyData?.pastRentals || []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.statsContainer}>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{historyData?.stats?.rentals || 4}</Text>
                <Text style={styles.statLabel}>Aluguéis</Text>
              </View>

              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{historyData?.stats?.days || 16}</Text>
                <Text style={styles.statLabel}>Diárias</Text>
              </View>

              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{historyData?.stats?.km || '2.112'}</Text>
                <Text style={styles.statLabel}>Km rodados</Text>
              </View>
            </View>
          }
          renderItem={({ item }) => {
            const carImg = item.image || getVehicleImage(item);
            return (
              <View style={styles.pastCard}>
                <View style={styles.carImageBox}>
                  {carImg ? (
                    <Image source={carImg} style={styles.cardCarImage} resizeMode="cover" />
                  ) : (
                    <Text style={styles.cardEmoji}>{item.emoji || '🚗'}</Text>
                  )}
                </View>

                <View style={styles.infoCol}>
                  <Text style={styles.carName}>{item.carName}</Text>
                <Text style={styles.dateAndDetails}>
                  {item.date} • {item.days} diárias • {item.km} km
                </Text>
                <Text style={styles.agencyText}>
                  <Ionicons name="location-outline" size={11} color={Colors.textSecondary} />{' '}
                  {item.agency}
                </Text>
              </View>

              <View style={styles.actionCol}>
                <Text style={styles.priceText}>R$ {item.total}</Text>
                <TouchableOpacity
                  style={styles.rentAgainButton}
                  onPress={() => handleRentAgain(item)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.rentAgainText}>Alugar de novo</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        />
      )}
    </View>
  );
}
