import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, AppState, AppStateStatus, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { authService } from '@/services/authService';
import { router } from 'expo-router';
import { useColorScheme } from './useColorScheme';
import { Palette } from '@/constants/Colors';
import { useLanguage } from '@/context/LanguageContext';

interface ProtectedScreenProps {
  children: React.ReactNode;
}

export default function ProtectedScreen({ children }: ProtectedScreenProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Palette[colorScheme];
  const { t } = useLanguage();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const appState = useRef(AppState.currentState);

  const verifySessionAndBiometrics = async () => {
    try {
      const token = await authService.getToken();
      if (!token) {
        setLoading(false);
        router.replace('/login');
        return;
      }

      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) {
        setIsAuthenticated(true);
        setLoading(false);
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: t('unlockMedicalRecords'),
        fallbackLabel: t('useDevicePassword'),
      });

      if (result.success) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error(t('error.authentication'), error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verifySessionAndBiometrics();

    const subscription = AppState.addEventListener('change', async (nextAppState: AppStateStatus) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        setIsAuthenticated(false);
        verifySessionAndBiometrics();
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.bg }]}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <View style={[styles.lockedContainer, { backgroundColor: colors.bg }]}>
        <Text style={[styles.lockedTitle, { color: colors.ink }]}>{t('secureMedicalArchive')}</Text>
        <Text style={[styles.lockedSubtitle, { color: colors.inkMuted }]}>
          {t('identifyMessage')}
        </Text>
        
        <TouchableOpacity 
          style={[styles.unlockButton, { backgroundColor: colors.accent }]} 
          onPress={verifySessionAndBiometrics}
        >
          <Text style={[styles.unlockButtonText, { color: colors.accentText }]}>{t('retryBiometrics')}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={async () => {
            await authService.logout();
            router.replace('/login');
          }}
        >
          <Text style={[styles.logoutButtonText, { color: colors.accent }]}>{t('differentAccount')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  lockedContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  lockedTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  lockedSubtitle: { fontSize: 14, textAlign: 'center', marginBottom: 24, lineHeight: 20 },
  unlockButton: { paddingVertical: 14, paddingHorizontal: 24, borderRadius: 10, marginBottom: 14, width: '100%', alignItems: 'center' },
  unlockButtonText: { fontSize: 16, fontWeight: '600' },
  logoutButton: { padding: 10 },
  logoutButtonText: { fontSize: 14, fontWeight: '500' },
});