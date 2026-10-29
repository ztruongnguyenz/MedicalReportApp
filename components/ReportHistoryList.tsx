import React, { useEffect, useState } from 'react';
import { 
  View, Text, FlatList, TextInput, StyleSheet, 
  TouchableOpacity, RefreshControl, ActivityIndicator 
} from 'react-native';
import { reportService, ReportItem } from '../services/api/reportService';
import { useColorScheme } from './useColorScheme';
import { Palette } from '@/constants/Colors';
import { useLanguage } from '@/context/LanguageContext';

export default function ReportHistoryList({ onSelectReport }: { onSelectReport: (id: string) => void }) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Palette[colorScheme];
  const { t } = useLanguage();

  const [reports, setReports] = useState<ReportItem[]>([]);
  const [filteredReports, setFilteredReports] = useState<ReportItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHistory = async () => {
    try {
      const data = await reportService.getHistory();
      setReports(data);
      setFilteredReports(data);
    } catch (error) {
      console.error(t('error.history'), error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredReports(reports);
    } else {
      setFilteredReports(
        reports.filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
  }, [searchQuery, reports]);

  const getStatusBadge = (status: ReportItem['status']) => {
    switch (status) {
      case 'normal': 
        return { bg: colors.surface2, color: colors.success, label: t('normal') };
      case 'attention': 
        return { bg: colors.surface2, color: colors.amber, label: t('attention') };
      case 'critical': 
        return { bg: colors.dangerSoft, color: colors.danger, label: t('critical') };
      default: 
        return { bg: colors.surface2, color: colors.inkMuted, label: t('unknown') };
    }
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.bg }]}>
        <ActivityIndicator color={colors.accent} size="large" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <TextInput 
        style={[
          styles.searchBar, 
          { backgroundColor: colors.surface, borderColor: colors.border, color: colors.ink }
        ]}
        placeholder={t('searchingReports')}
        placeholderTextColor={colors.inkMuted}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList 
        data={filteredReports} 
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={() => { setRefreshing(true); fetchHistory(); }} 
          />
        }
        renderItem={({ item }) => {
          const badge = getStatusBadge(item.status);
          return (
            <TouchableOpacity 
              style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]} 
              onPress={() => onSelectReport(item.id)}
            >
              <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: colors.ink }]}>{item.title}</Text>
                <View style={[styles.badge, { backgroundColor: badge.bg }]}>
                  <Text style={[styles.badgeText, { color: badge.color }]}>{badge.label}</Text>
                </View>
              </View>
              <Text style={[styles.cardDate, { color: colors.inkMuted }]}>Ngày: {item.date}</Text>
              <Text style={[styles.cardSummary, { color: colors.ink }]} numberOfLines={2}>
                {item.summary}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16 
  },
  center: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  searchBar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    fontSize: 15,
    marginBottom: 16,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  cardHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 6 
  },
  cardTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    flex: 1 
  },
  badge: { 
    paddingHorizontal: 8, 
    paddingVertical: 4, 
    borderRadius: 6 
  },
  badgeText: { 
    fontSize: 12, 
    fontWeight: '700' 
  },
  cardDate: { 
    fontSize: 12, 
    marginBottom: 6 
  },
  cardSummary: { 
    fontSize: 14, 
    lineHeight: 20 
  },
});