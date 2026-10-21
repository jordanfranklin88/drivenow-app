import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import styles from './styles/SuccessScreen.styles';

export default function SuccessScreen({ route, navigation }) {
  const { reservation } = route.params;

  const handleGoToInspection = () => {
    navigation.navigate('Inspection', { reservation });
  };

  const handleGoToReservations = () => {
    navigation.navigate('MainTabs', { screen: 'Reservations' });
  };

  const handleGoHome = () => {
    navigation.navigate('MainTabs', { screen: 'Home' });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {}
        <View style={styles.successIconCircle}>
          <Ionicons name="checkmark-sharp" size={44} color={Colors.primary} />
        </View>

        <Text style={styles.title}>Reserva Confirmada!</Text>
        <Text style={styles.subtitle}>
          Seu {reservation?.carName || 'veículo'} estará te esperando na agência{' '}
          {reservation?.agency || 'Aeroporto de Maceió'} no dia da retirada.
        </Text>

        {/* Código da Reserva */}
        <View style={styles.codeCard}>
          <Text style={styles.codeLabel}>CÓDIGO DA SUA RESERVA</Text>
          <Text style={styles.codeValue}>{reservation?.code || 'AF-8K2M4X'}</Text>
          <Text style={styles.codeTip}>
            Apresente este código junto com sua CNH no balcão da agência.
          </Text>
        </View>

        {/* Resumo do Período e Diárias */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Ionicons name="calendar" size={16} color={Colors.primary} />
            <Text style={styles.summaryText}>
              Retirada: <Text style={styles.summaryTextBold}>{reservation?.pickupDate}</Text>
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Ionicons name="calendar-outline" size={16} color={Colors.primary} />
            <Text style={styles.summaryText}>
              Devolução: <Text style={styles.summaryTextBold}>{reservation?.returnDate}</Text>
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Ionicons name="time-outline" size={16} color={Colors.primary} />
            <Text style={styles.summaryText}>
              Duração:{' '}
              <Text style={styles.summaryTextBold}>
                {reservation?.days || 4} {(reservation?.days || 4) === 1 ? 'diária' : 'diárias'} (Total: R$ {reservation?.total})
              </Text>
            </Text>
          </View>
        </View>

        {}
        <View style={styles.nativeFeatureCard}>
          <View style={styles.nativeHeader}>
            <Ionicons name="camera" size={22} color={Colors.primary} />
            <Text style={styles.nativeTitle}>Vistoria Digital e CNH</Text>
          </View>
          <Text style={styles.nativeDescription}>
            Agilize a retirada! Use a câmera do celular para tirar foto da sua CNH
            ou registrar o estado do veículo antes de sair da loja.
          </Text>

          <TouchableOpacity
            style={styles.inspectionButton}
            onPress={handleGoToInspection}
            activeOpacity={0.85}
          >
            <Ionicons name="camera-outline" size={18} color={Colors.textOnPrimary} />
            <Text style={styles.inspectionButtonText}>Abrir Câmera para Vistoria</Text>
          </TouchableOpacity>
        </View>

        {}
        <TouchableOpacity
          style={styles.reservationsButton}
          onPress={handleGoToReservations}
          activeOpacity={0.85}
        >
          <Ionicons name="calendar-outline" size={18} color={Colors.primary} />
          <Text style={styles.reservationsButtonText}>Ver Minhas Reservas</Text>
        </TouchableOpacity>

        {}
        <TouchableOpacity
          style={styles.homeButton}
          onPress={handleGoHome}
          activeOpacity={0.85}
        >
          <Text style={styles.homeButtonText}>Voltar ao Início</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
