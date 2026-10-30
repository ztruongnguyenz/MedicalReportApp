import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useLanguage } from '@/context/LanguageContext';
import { useColorScheme } from '@/components/useColorScheme';
import { Palette } from '@/constants/Colors';
import Ionicons from '@react-native-vector-icons/ionicons';

export default function RegisterScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Palette[colorScheme];

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = () => {
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert(t('alert.title'), t('fillAllFields') || 'Please fill in all required fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert(t('alert.title'), t('passwordMismatch') || 'Passwords do not match');
      return;
    }

    // Giả lập đăng ký thành công
    Alert.alert('Success', 'Account created successfully!', [
      { text: 'OK', onPress: () => router.replace('/(tabs)') },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerSection}>
          <Text style={[styles.title, { color: colors.ink }]}>
            {t('registerTitle')}
          </Text>
          <Text style={[styles.subtitle, { color: colors.inkMuted }]}>
            {t('registerSubtitle')}
          </Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                color: colors.ink,
              },
            ]}
            placeholder={t('fullNamePlaceholder')}
            placeholderTextColor={colors.inkMuted}
            value={fullName}
            onChangeText={setFullName}
          />

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                color: colors.ink,
              },
            ]}
            placeholder={t('emailPlaceholder') || 'Email Address'}
            placeholderTextColor={colors.inkMuted}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                color: colors.ink,
              },
            ]}
            placeholder={t('passwordPlaceholder') || 'Password'}
            placeholderTextColor={colors.inkMuted}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                color: colors.ink,
              },
            ]}
            placeholder={t('confirmPasswordPlaceholder')}
            placeholderTextColor={colors.inkMuted}
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <Text style={[styles.termsText, { color: colors.inkMuted }]}>
            {t('termsAgree')}
          </Text>

          <TouchableOpacity
            style={[styles.submitBtn, { backgroundColor: colors.accent }]}
            onPress={handleRegister}
            activeOpacity={0.8}
          >
            <Text style={styles.submitBtnText}>{t('registerButton')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={{ color: colors.inkMuted }}>
            {t('alreadyHaveAccount')}{' '}
          </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={[styles.loginLink, { color: colors.accent }]}>
              {t('loginButton') || 'Log In'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 24, paddingTop: 60, flexGrow: 1 },
  backBtn: { width: 40, height: 40, justifyContent: 'center', marginBottom: 16 },
  headerSection: { marginBottom: 32 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 8 },
  subtitle: { fontSize: 15, lineHeight: 22 },
  form: { gap: 16 },
  input: { height: 52, borderWidth: 1, borderRadius: 10, paddingHorizontal: 16, fontSize: 15 },
  termsText: { fontSize: 12, textAlign: 'center', lineHeight: 18, marginVertical: 8 },
  submitBtn: { height: 52, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 8 },
  submitBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 'auto', paddingVertical: 24 },
  loginLink: { fontWeight: '600' },
});