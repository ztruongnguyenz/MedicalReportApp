import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { reportService } from '../services/api/reportService';
import { useColorScheme } from './useColorScheme';
import { Palette } from '@/constants/Colors';
import { useLanguage } from '@/context/LanguageContext';

export default function ReportScanner({ onAnalysisComplete }: { onAnalysisComplete: (result: any) => void }) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Palette[colorScheme];
  const { t } = useLanguage();

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const pickOrTakePhoto = async (useCamera = false) => {
    const permission = useCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(t('alert.permission'), t('alert.permissionMessage'));
      return;
    }

    const result = useCamera
      ? await ImagePicker.launchCameraAsync({ quality: 0.8, allowsEditing: false })
      : await ImagePicker.launchImageLibraryAsync({ quality: 0.8, allowsEditing: false });

    if (!result.canceled && result.assets[0]?.uri) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      handleUpload(uri);
    }
  };

  const handleUpload = async (uri: string) => {
    setUploading(true);
    setProgress(0);

    try {
      const responseData = await reportService.uploadAndAnalyze(uri, (percent) => setProgress(percent));
      setUploading(false);
      Alert.alert(t('alert.success'), t('alert.successAnalyticsMessage'));
      onAnalysisComplete(responseData);
    } catch (error: any) {
      setUploading(false);
      Alert.alert(t('alert.uploadError'), error?.response?.data?.message || t('alert.uploadErrorMessage'));
    }
  };

  return (
    <View style={styles.container}>
      {imageUri && (
        <Image 
          source={{ uri: imageUri }} 
          style={[styles.preview, { borderColor: colors.border }]} 
        />
      )}

      {uploading ? (
        <View style={styles.progressContainer}>
          <ActivityIndicator color={colors.accent} size="large" />
          <Text style={[styles.progressText, { color: colors.accent }]}>
            {t('progressing')}: {progress}%
          </Text>
        </View>
      ) : (
        <View style={styles.buttonGroup}>
          <TouchableOpacity 
            style={[styles.btnPrimary, { backgroundColor: colors.accent }]} 
            onPress={() => pickOrTakePhoto(true)}
          >
            <Text style={[styles.btnPrimaryText, { color: colors.accentText }]}>
              {t('takePhoto')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.btnSecondary, { backgroundColor: colors.surface2, borderColor: colors.border }]} 
            onPress={() => pickOrTakePhoto(false)}
          >
            <Text style={[styles.btnSecondaryText, { color: colors.ink }]}>
              {t('pickGallery')}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    width: '100%', 
    alignItems: 'center' 
  },
  preview: { 
    width: 220, 
    height: 280, 
    borderRadius: 10, 
    marginBottom: 20, 
    borderWidth: 1 
  },
  progressContainer: { 
    marginVertical: 20, 
    alignItems: 'center' 
  },
  progressText: { 
    marginTop: 10, 
    fontSize: 15, 
    fontWeight: '600' 
  },
  buttonGroup: { 
    width: '100%', 
    gap: 12 
  },
  btnPrimary: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimaryText: {
    fontSize: 16,
    fontWeight: '600',
  },
  btnSecondary: {
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnSecondaryText: {
    fontSize: 16,
    fontWeight: '600',
  },
});