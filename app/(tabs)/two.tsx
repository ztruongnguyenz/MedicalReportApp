import React from 'react';
import { StyleSheet } from 'react-native';
import { View } from '@/components/Themed';
import ProtectedScreen from '@/components/ProtectedScreen';
import ReportHistoryList from '@/components/ReportHistoryList';
import { router } from 'expo-router';

export default function TabTwoScreen() {
  const handleSelectReport = (reportId: string) => {
    // Navigates to app/report/[id].tsx passing the specific report ID
    router.push(`/report/${reportId}`);
  };

  return (
    <ProtectedScreen>
      <View style={styles.container}>
        <ReportHistoryList onSelectReport={handleSelectReport} />
      </View>
    </ProtectedScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});