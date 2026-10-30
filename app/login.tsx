import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import { authService } from '@/services/authService';
import { router } from 'expo-router';
import { useColorScheme } from '@/components/useColorScheme';
import { Palette } from '@/constants/Colors';
import { useLanguage } from '@/context/LanguageContext';
import * as LocalAuthentication from 'expo-local-authentication';
import Ionicons from '@react-native-vector-icons/ionicons';

export default function LoginScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Palette[colorScheme];
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);

  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);
    })();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(t('alert.title'), t('alert.loginRequired'));
      return;
    }

    setLoading(true);
    try {
      await authService.login(email, password);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert(t('alert.authenFailedTitle'), error.message || t('alert.authenFailedMessage'));
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    try {
      const biometricAuth = await LocalAuthentication.authenticateAsync({
        promptMessage: t('unlockMedicalRecords'),
        fallbackLabel: t('useDevicePassword'),
      });

      if (biometricAuth.success) {
        router.replace('/(tabs)');
      }
    } catch (error) {
      console.log('Biometric error:', error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.accent }]}>{t('loginTitle')}</Text>
        <Text style={[styles.subtitle, { color: colors.inkMuted }]}>{t('loginSubtitle')}</Text>

        <TextInput
          style={[styles.input, { backgroundColor: colors.surface2, borderColor: colors.border, color: colors.ink }]}
          placeholder={t('emailPlaceholder')}
          placeholderTextColor={colors.inkMuted}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={[styles.input, { backgroundColor: colors.surface2, borderColor: colors.border, color: colors.ink }]}
          placeholder={t('passwordPlaceholder')}
          placeholderTextColor={colors.inkMuted}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity 
          style={[styles.button, { backgroundColor: colors.accent }]} 
          onPress={handleLogin} 
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.accentText} />
          ) : (
            <Text style={[styles.buttonText, { color: colors.accentText }]}>{t('loginButton')}</Text>
          )}
        </TouchableOpacity>

        {isBiometricSupported && (
          <TouchableOpacity 
            style={[styles.biometricButton, { borderColor: colors.accent }]} 
            onPress={handleBiometricLogin}
          >
            <Ionicons name="finger-print-outline" size={22} color={colors.accent} style={{ marginRight: 8 }} />
            <Text style={[styles.biometricText, { color: colors.accent }]}>
              {t('useBiometrics')}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.forgotBtn}
          onPress={() => router.push('/forgot-password')}
          activeOpacity={0.7}
        >
          <Text style={[styles.forgotText, { color: colors.accent }]}>
            {t('forgotPasswordQuestion')}
          </Text>
        </TouchableOpacity>

      </View>
      <View style={styles.registerPrompt}>
        <Text style={{ color: colors.inkMuted }}>
          {t('dontHaveAccount')}{' '}
        </Text>
        <TouchableOpacity onPress={() => router.push('/register')} activeOpacity={0.7}>
          <Text style={[styles.registerText, { color: colors.accent }]}>
            {t('registerButton')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  card: { borderRadius: 16, padding: 24, borderWidth: 1 },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 6, textAlign: 'center' },
  subtitle: { fontSize: 14, opacity: 0.8, marginBottom: 24, textAlign: 'center', lineHeight: 20 },
  input: { padding: 14, borderRadius: 10, marginBottom: 16, fontSize: 15, borderWidth: 1 },
  button: { padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 8 },
  buttonText: { fontSize: 16, fontWeight: '600' },
  biometricButton: { 
    flexDirection: 'row', 
    padding: 12, 
    borderRadius: 10, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginTop: 12, 
    borderWidth: 1 
  },
  biometricText: { fontSize: 15, fontWeight: '600' },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginVertical: 8,
  },
  forgotText: {
    fontSize: 14,
    fontWeight: '600',
  },
  registerPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  registerText: {
    fontSize: 14,
    fontWeight: '600',
  },
});