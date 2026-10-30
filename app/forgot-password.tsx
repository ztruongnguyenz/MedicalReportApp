import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useLanguage } from '@/context/LanguageContext';
import { useColorScheme } from '@/components/useColorScheme';
import { Palette } from '@/constants/Colors';
import Ionicons from '@react-native-vector-icons/ionicons';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Palette[colorScheme];

  const [email, setEmail] = useState('');

  const handleResetPassword = () => {
    if (!email) {
      Alert.alert(t('alert.title'), t('fillAllFields') || 'Please enter your email');
      return;
    }

    Alert.alert('Success', t('resetEmailSent') || 'Recovery link has been sent.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <View style={styles.headerSection}>
          <Text style={[styles.title, { color: colors.ink }]}>
            {t('forgotPasswordTitle')}
          </Text>
          <Text style={[styles.subtitle, { color: colors.inkMuted }]}>
            {t('forgotPasswordSubtitle')}
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
            placeholder={t('emailPlaceholder') || 'Email Address'}
            placeholderTextColor={colors.inkMuted}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <TouchableOpacity
            style={[styles.submitBtn, { backgroundColor: colors.accent }]}
            onPress={handleResetPassword}
            activeOpacity={0.8}
          >
            <Text style={styles.submitBtnText}>{t('sendResetLink')}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.backToLoginBtn}
          onPress={() => router.back()}
        >
          <Text style={[styles.backToLoginText, { color: colors.accent }]}>
            {t('backToLogin')}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24, paddingTop: 60, flex: 1 },
  backBtn: { width: 40, height: 40, justifyContent: 'center', marginBottom: 16 },
  headerSection: { marginBottom: 32 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 8 },
  subtitle: { fontSize: 15, lineHeight: 22 },
  form: { gap: 16 },
  input: { height: 52, borderWidth: 1, borderRadius: 10, paddingHorizontal: 16, fontSize: 15 },
  submitBtn: { height: 52, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 8 },
  submitBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  backToLoginBtn: { alignItem: 'center', marginTop: 24, alignSelf: 'center' },
  backToLoginText: { fontWeight: '600', fontSize: 15 },
});