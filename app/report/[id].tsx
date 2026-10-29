import React, { useEffect, useState } from 'react';
import { StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Text, View } from '@/components/Themed';
import HealthTrendsChart from '@/components/HealthTrendsChart';
import { reportService } from '@/services/api/reportService';
import ProtectedScreen from '@/components/ProtectedScreen';
import { useColorScheme } from '@/components/useColorScheme';
import { Palette } from '@/constants/Colors';
import { useLanguage } from '@/context/LanguageContext';

export default function ReportDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Palette[colorScheme];
  const { t } = useLanguage();

  const [metricData, setMetricData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await reportService.getReportDetails(id as string);
        setMetricData(data);
      } catch (error) {
        console.error(t('error.reportDetails'), error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <ProtectedScreen>
        <View style={[styles.center, { backgroundColor: colors.bg }]}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      </ProtectedScreen>
    );
  }

  return (
    <ProtectedScreen>
      <ScrollView style={[styles.wrapper, { backgroundColor: colors.bg }]} contentContainerStyle={styles.container}>
        <View style={[styles.headerCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.ink }]}>{metricData?.title || t('reportDetails')}</Text>
          <Text style={[styles.date, { color: colors.inkMuted }]}>t('uploadDate') {metricData?.date}</Text>
          <Text style={[styles.summary, { color: colors.ink }]}>{metricData?.summary}</Text>
        </View>

        {/* Biểu đồ xu hướng chỉ số */}
        <HealthTrendsChart 
          title={t('trendAnalytics')}
          unit={metricData?.unit || 'mg/dL'} 
          data={metricData?.trendData || []} 
        />
      </ScrollView>
    </ProtectedScreen>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  container: { padding: 20, paddingBottom: 40 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerCard: {
    borderRadius: 12,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: '#12211C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 6 },
  date: { fontSize: 13, marginBottom: 12 },
  summary: { fontSize: 15, lineHeight: 22 },
});