import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { useColorScheme } from './useColorScheme';
import { Palette } from '@/constants/Colors';
import { useLanguage } from '@/context/LanguageContext';

interface ChartProps {
  title: string;
  unit: string;
  data: { value: number; label: string }[];
}

export default function HealthTrendsChart({ title, unit, data }: ChartProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Palette[colorScheme];
  const { t } = useLanguage();

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Text style={[styles.title, { color: colors.ink }]}>{title}</Text>
      <Text style={[styles.subtitle, { color: colors.inkMuted }]}>{t('unit')}: {unit}</Text>
      
      <View style={styles.chartContainer}>
        <LineChart
          data={data}
          color={colors.accent}
          thickness={3}
          dataPointsColor={colors.accent}
          dataPointsRadius={5}
          textFontSize={12}
          textColor={colors.ink}
          yAxisTextStyle={{ color: colors.inkMuted }}
          xAxisLabelTextStyle={{ color: colors.inkMuted, fontSize: 10 }}
          isAnimated
          animationDuration={1000}
          noOfSections={4}
          spacing={60}
          rulesColor={colors.border}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 10,
    borderWidth: 1,
    shadowColor: '#12211C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  title: { fontSize: 18, fontWeight: 'bold' },
  subtitle: { fontSize: 12, marginBottom: 15 },
  chartContainer: { alignItems: 'center', marginTop: 10 },
});