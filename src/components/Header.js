import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';

export default function Header({ userName = 'JF Souza', onLocationPress, onProfilePress }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      
      <View style={styles.content}>
        <View>
          <Text style={styles.greeting}>Olá, {userName} 👋</Text>
          <Text style={styles.title}>DriveNow</Text>
        </View>

        <View style={styles.actions}>
          {onLocationPress && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={onLocationPress}
              activeOpacity={0.8}
            >
              <Ionicons name="location-outline" size={20} color={Colors.textOnPrimary} />
            </TouchableOpacity>
          )}

          {onProfilePress && (
            <TouchableOpacity
              style={styles.avatarButton}
              onPress={onProfilePress}
              activeOpacity={0.8}
            >
              <Image
                source={require('../../assets/user_profile.jpg')}
                style={styles.avatarImage}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    paddingTop: 16,
    paddingBottom: 22,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '500',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.textOnPrimary,
    marginTop: 2,
    letterSpacing: -0.3,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});
