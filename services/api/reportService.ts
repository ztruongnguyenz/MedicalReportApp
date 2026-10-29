import { apiClient } from './client';
import * as ImageManipulator from 'expo-image-manipulator';
import { mockReportService } from './mockReportService';

// Flag checking if mock mode is enabled
const USE_MOCK = process.env.EXPO_PUBLIC_USE_MOCK === 'true';

export interface ReportItem {
  id: string;
  date: string;
  title: string;
  status: 'normal' | 'attention' | 'critical';
  summary: string;
}

export const reportService = {
  /**
   * Compresses the image locally and uploads it with upload progress tracking.
   */
  uploadAndAnalyze: async (imageUri: string, onProgress?: (progress: number) => void) => {
    if (USE_MOCK) {
      return mockReportService.uploadAndAnalyze(imageUri, onProgress);
    }

    // 1. Client-side compression
    const manipulated = await ImageManipulator.manipulateAsync(
      imageUri,
      [{ resize: { width: 1200 } }],
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
    );

    // 2. Build form data payload
    const formData = new FormData();
    const filename = manipulated.uri.split('/').pop() || 'report.jpg';

    // @ts-ignore
    formData.append('file', {
      uri: manipulated.uri,
      name: filename,
      type: 'image/jpeg',
    });

    // 3. Post to API client
    const response = await apiClient.post('/reports/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      },
    });

    return response.data;
  },

  /**
   * Fetches user's past uploaded reports list.
   */
  getHistory: async (): Promise<ReportItem[]> => {
    if (USE_MOCK) {
      return mockReportService.getHistory();
    }

    const response = await apiClient.get('/reports/history');
    return response.data;
  },

  /**
   * Fetches detailed metrics and trends for a specific report.
   */
  getReportDetails: async (reportId: string) => {
    if (USE_MOCK) {
      return mockReportService.getReportDetails(reportId);
    }
    
    const response = await apiClient.get(`/reports/${reportId}`);
    return response.data;
  },
};