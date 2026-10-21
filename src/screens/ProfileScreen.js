import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import styles from './styles/ProfileScreen.styles';

export default function ProfileScreen({ navigation }) {
  const handleLogout = () => {
    Alert.alert('Sair da Conta', 'Deseja realmente sair da sua conta DriveNow?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: () => {
          navigation.replace('Login');
        },
      },
    ]);
  };

  const sections = [
    {
      title: 'Recursos Nativos da Prova',
      items: [
        {
          icon: 'camera-outline',
          label: 'Câmera: Vistoria e Envio da CNH',
          onPress: () => navigation.navigate('Inspection'),
          badge: 'Nativo',
        },
        {
          icon: 'navigate-outline',
          label: 'GPS: Agências e Carros Próximos',
          onPress: () => navigation.navigate('Location'),
          badge: 'Nativo',
        },
      ],
    },
    {
      title: 'Minha Conta',
      items: [
        { icon: 'document-text-outline', label: 'Dados pessoais e CNH', onPress: () => navigation.navigate('Inspection') },
        { icon: 'card-outline', label: 'Formas de pagamento e cartões', onPress: () => Alert.alert('Cartões', '1 cartão de crédito MasterCard final 8820 cadastrado.') },
        { icon: 'location-outline', label: 'Endereços salvos', onPress: () => Alert.alert('Endereços', 'Maceió - AL cadastrado como principal.') },
      ],
    },
    {
      title: 'Preferências',
      items: [
        { icon: 'notifications-outline', label: 'Notificações e alertas', onPress: () => Alert.alert('Notificações', 'Notificações push ativas.') },
        { icon: 'lock-closed-outline', label: 'Segurança e senha', onPress: () => Alert.alert('Segurança', 'Autenticação em 2 fatores ativa.') },
        { icon: 'shield-outline', label: 'Privacidade e termos de uso', onPress: () => Alert.alert('Termos', 'Termos aceitos em conformidade com a LGPD.') },
      ],
    },
    {
      title: 'Ajuda e Atendimento',
      items: [
        { icon: 'help-circle-outline', label: 'Central de ajuda FAQ', onPress: () => Alert.alert('Central de Ajuda', 'Telefone 0800 979 2000 ou chat 24h.') },
        { icon: 'mail-outline', label: 'Fale com o suporte', onPress: () => Alert.alert('Suporte', 'E-mail enviado para suporte@alugafacil.com.br') },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      {}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Meu Perfil</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {}
        <View style={styles.userCard}>
          <Image
            source={require('../../assets/user_profile.jpg')}
            style={styles.avatarImage}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.userName}>J. F. Souza</Text>
            <Text style={styles.userEmail}>jfsouza@gmail.com</Text>
            <View style={styles.badgeRow}>
              <Ionicons name="star" size={12} color="#D97706" />
              <Text style={styles.badgeText}>Cliente Ouro • 1.240 pts</Text>
            </View>
          </View>
        </View>

        {}
        {sections.map((section, sIdx) => (
          <View key={sIdx} style={styles.sectionBlock}>
            <Text style={styles.sectionHeader}>{section.title}</Text>
            <View style={styles.sectionCard}>
              {section.items.map((item, iIdx) => (
                <TouchableOpacity
                  key={iIdx}
                  style={[
                    styles.menuItem,
                    iIdx < section.items.length - 1 && styles.menuItemBorder,
                  ]}
                  onPress={item.onPress}
                  activeOpacity={0.7}
                >
                  <View style={styles.itemIconCircle}>
                    <Ionicons name={item.icon} size={18} color={Colors.primary} />
                  </View>
                  <Text style={styles.itemLabel}>{item.label}</Text>
                  {item.badge && (
                    <View style={styles.nativeBadge}>
                      <Text style={styles.nativeBadgeText}>{item.badge}</Text>
                    </View>
                  )}
                  <Ionicons name="chevron-forward" size={16} color={Colors.textLight} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={18} color={Colors.danger} />
          <Text style={styles.logoutText}>Sair da conta</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>DriveNow v1.0.0 • Feito em React Native & Expo</Text>
      </ScrollView>
    </View>
  );
}
