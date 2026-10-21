import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from '../constants/colors';
import { ApiService } from '../services/api';
import styles from './styles/InspectionScreen.styles';

export default function InspectionScreen({ route, navigation }) {
  const reservation = route.params?.reservation || {
    id: 'res-1',
    code: 'AF-8K2M4X',
    carName: 'Jeep Renegade',
    agency: 'Aeroporto de Maceió',
  };

  const [photoUri, setPhotoUri] = useState(reservation.inspectionPhoto || null);
  const [inspectionType, setInspectionType] = useState('cnh');
  const [saving, setSaving] = useState(false);

  const handleTakePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permissão Necessária',
          'Precisamos de acesso à sua câmera para realizar a vistoria do veículo ou validar sua CNH.'
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch (error) {
      console.log('Erro ao abrir a câmera:', error);
      Alert.alert('Erro', 'Não foi possível acionar a câmera nativa.');
    }
  };

  const handlePickFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch (error) {
      console.log('Erro ao abrir a galeria:', error);
    }
  };

  const handleSaveInspection = async () => {
    if (!photoUri) {
      Alert.alert('Atenção', 'Tire ou selecione uma foto antes de salvar a vistoria.');
      return;
    }

    try {
      setSaving(true);
      await ApiService.saveInspection(reservation.id, photoUri);
      Alert.alert(
        'Vistoria Salva com Sucesso! 🎉',
        `A foto foi registrada com sucesso para a reserva ${reservation.code}.`,
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a vistoria.');
    } finally {
      setSaving(false);
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
        <Text style={styles.topBarTitle}>Vistoria com Câmera</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {}
        <View style={styles.nativeBadgeCard}>
          <View style={styles.badgeHeader}>
            <Ionicons name="camera" size={20} color={Colors.primary} />
            <Text style={styles.badgeTitle}>Recurso Nativo: Câmera</Text>
          </View>
          <Text style={styles.badgeDescription}>
            Utiliza a câmera nativa do dispositivo para capturar fotos em alta resolução
            e vincular ao histórico da locação.
          </Text>
        </View>

        {}
        <View style={styles.resSummaryCard}>
          <Text style={styles.summaryLabel}>RESERVA ATUAL</Text>
          <Text style={styles.summaryCar}>{reservation.carName}</Text>
          <Text style={styles.summaryCode}>Código: {reservation.code} • {reservation.agency}</Text>
        </View>

        {}
        <View style={styles.typeSelector}>
          <TouchableOpacity
            style={[styles.typeButton, inspectionType === 'cnh' && styles.typeButtonActive]}
            onPress={() => setInspectionType('cnh')}
          >
            <Ionicons
              name="card-outline"
              size={18}
              color={inspectionType === 'cnh' ? Colors.primary : Colors.textSecondary}
            />
            <Text style={[styles.typeText, inspectionType === 'cnh' && styles.typeTextActive]}>
              Foto da CNH
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.typeButton, inspectionType === 'car' && styles.typeButtonActive]}
            onPress={() => setInspectionType('car')}
          >
            <Ionicons
              name="car-outline"
              size={18}
              color={inspectionType === 'car' ? Colors.primary : Colors.textSecondary}
            />
            <Text style={[styles.typeText, inspectionType === 'car' && styles.typeTextActive]}>
              Vistoria do Carro
            </Text>
          </TouchableOpacity>
        </View>

        {}
        <View style={styles.photoContainer}>
          {photoUri ? (
            <View style={styles.previewWrapper}>
              <Image source={{ uri: photoUri }} style={styles.previewImage} />
              <View style={styles.timestampBadge}>
                <Ionicons name="time-outline" size={12} color="#FFFFFF" />
                <Text style={styles.timestampText}>
                  Registrado em {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR').substring(0, 5)}
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.placeholderWrapper}>
              <Ionicons name="camera-outline" size={54} color={Colors.textLight} />
              <Text style={styles.placeholderTitle}>
                {inspectionType === 'cnh'
                  ? 'Nenhuma foto da CNH enviada'
                  : 'Nenhuma foto de vistoria tirada'}
              </Text>
              <Text style={styles.placeholderSubtitle}>
                Toque nos botões abaixo para acionar a câmera do celular.
              </Text>
            </View>
          )}
        </View>

        {}
        <View style={styles.cameraButtonsRow}>
          <TouchableOpacity
            style={styles.openCameraButton}
            onPress={handleTakePhoto}
            activeOpacity={0.85}
          >
            <Ionicons name="camera" size={20} color={Colors.textOnPrimary} />
            <Text style={styles.openCameraButtonText}>
              {photoUri ? 'Tirar Outra Foto' : 'Tirar Foto com a Câmera'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.galleryButton}
            onPress={handlePickFromGallery}
            activeOpacity={0.85}
          >
            <Ionicons name="images-outline" size={20} color={Colors.primary} />
            <Text style={styles.galleryButtonText}>Galeria</Text>
          </TouchableOpacity>
        </View>

        {}
        {photoUri && (
          <TouchableOpacity
            style={[styles.saveButton, saving && styles.saveButtonDisabled]}
            onPress={handleSaveInspection}
            disabled={saving}
            activeOpacity={0.9}
          >
            {saving ? (
              <ActivityIndicator size="small" color={Colors.textOnPrimary} />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={18} color={Colors.textOnPrimary} />
                <Text style={styles.saveButtonText}>Confirmar e Salvar Vistoria</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}
