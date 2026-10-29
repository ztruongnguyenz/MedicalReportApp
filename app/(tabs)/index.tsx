import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, View } from '@/components/Themed';
import ProtectedScreen from '@/components/ProtectedScreen';
import ReportScanner from '@/components/ReportScanner';
import { authService } from '@/services/authService';
import { router } from 'expo-router';
import { useColorScheme } from '@/components/useColorScheme';
import { Palette } from '@/constants/Colors';
import { useLanguage } from '@/context/LanguageContext';

export default function TabOneScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Palette[colorScheme];
  const { t } = useLanguage();

  const handleLogout = async () => {
    await authService.logout();
    router.replace('/login');
  };

  return (
    <ProtectedScreen>
      <ScrollView style={[styles.wrapper, { backgroundColor: colors.bg }]} contentContainerStyle={styles.container}>
        {/* Top Header */}
        <View style={[styles.headerRow, { backgroundColor: colors.bg }]}>
          <View style={{ backgroundColor: 'transparent' }}>
            <Text style={[styles.greeting, { color: colors.inkMuted }]}>{t('welcome')},</Text>
          </View>
          <TouchableOpacity style={[styles.logoutBtn, { backgroundColor: colors.dangerSoft }]} onPress={handleLogout}>
            <Text style={[styles.logoutText, { color: colors.danger }]}>{t('logout')}</Text>
          </TouchableOpacity>
        </View>

        {/* Hero Card */}
        <View style={[styles.bannerCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.bannerTitle, { color: colors.accent }]}>{t('scanTitle')}</Text>
          <Text style={[styles.bannerSubtitle, { color: colors.inkMuted }]}>{t('scanSubtitle')}</Text>
        </View>

        {/* Scanner Component Card */}
        <View style={[styles.scannerCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <ReportScanner onAnalysisComplete={(res) => console.log(res)} />
        </View>
      </ScrollView>
    </ProtectedScreen>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 14,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  logoutBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  logoutText: {
    fontSize: 13,
    fontWeight: '600',
  },
  bannerCard: {
    borderRadius: 12,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    shadowColor: '#12211C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  bannerSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  scannerCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    shadowColor: '#12211C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
});