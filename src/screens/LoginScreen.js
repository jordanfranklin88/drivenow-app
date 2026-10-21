import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import styles from './styles/LoginScreen.styles';

export default function LoginScreen({ navigation }) {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpf, setCpf] = useState('');

  const handleAuth = () => {
    navigation.replace('MainTabs');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
        {}
        <View style={styles.topBanner}>
          <Image
            source={require('../../assets/drivenow_logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.appName}>DriveNow</Text>
          <Text style={styles.appSlogan}>
            Seu carro, do seu jeito, onde você estiver.
          </Text>
        </View>

        {}
        <View style={styles.formCard}>
          {}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tabButton, mode === 'login' && styles.tabButtonActive]}
              onPress={() => setMode('login')}
            >
              <Text style={[styles.tabText, mode === 'login' && styles.tabTextActive]}>
                Entrar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabButton, mode === 'signup' && styles.tabButtonActive]}
              onPress={() => setMode('signup')}
            >
              <Text style={[styles.tabText, mode === 'signup' && styles.tabTextActive]}>
                Criar conta
              </Text>
            </TouchableOpacity>
          </View>

          {}
          <View style={styles.inputsWrapper}>
            {mode === 'signup' && (
              <>
                <View style={styles.inputBox}>
                  <Ionicons name="person-outline" size={18} color={Colors.textSecondary} />
                  <TextInput
                    style={styles.input}
                    placeholder="Nome completo"
                    placeholderTextColor={Colors.textLight}
                    value={name}
                    onChangeText={setName}
                  />
                </View>

                <View style={styles.inputBox}>
                  <Ionicons name="card-outline" size={18} color={Colors.textSecondary} />
                  <TextInput
                    style={styles.input}
                    placeholder="CPF (apenas números)"
                    placeholderTextColor={Colors.textLight}
                    keyboardType="numeric"
                    value={cpf}
                    onChangeText={setCpf}
                  />
                </View>
              </>
            )}

            <View style={styles.inputBox}>
              <Ionicons name="mail-outline" size={18} color={Colors.textSecondary} />
              <TextInput
                style={styles.input}
                placeholder="@gmail.com"
                placeholderTextColor={Colors.textLight}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputBox}>
              <Ionicons name="lock-closed-outline" size={18} color={Colors.textSecondary} />
              <TextInput
                style={styles.input}
                placeholder="Senha"
                placeholderTextColor={Colors.textLight}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            {mode === 'login' && (
              <TouchableOpacity
                onPress={() => Alert.alert('Recuperar Senha', 'Enviamos um link para o seu e-mail cadastrado.')}
                style={styles.forgotButton}
              >
                <Text style={styles.forgotText}>Esqueci minha senha</Text>
              </TouchableOpacity>
            )}

            {}
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleAuth}
              activeOpacity={0.9}
            >
              <Text style={styles.primaryButtonText}>
                {mode === 'login' ? 'Entrar' : 'Cadastrar'}
              </Text>
            </TouchableOpacity>
          </View>

          {}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ou continue com</Text>
            <View style={styles.dividerLine} />
          </View>

          {}
          <TouchableOpacity
            style={styles.socialButton}
            onPress={handleAuth}
            activeOpacity={0.8}
          >
            <Ionicons name="logo-google" size={18} color="#EA4335" />
            <Text style={styles.socialButtonText}>Continuar com Google</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.socialButton}
            onPress={handleAuth}
            activeOpacity={0.8}
          >
            <Ionicons name="logo-apple" size={18} color="#000000" />
            <Text style={styles.socialButtonText}>Continuar com Apple</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
