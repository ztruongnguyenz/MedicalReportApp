import { ReportItem } from './reportService';

// Simulated delay to mimic real network latency (e.g., 800ms)
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock database storage
let mockReports: ReportItem[] = [
  {
    id: 'rep-001',
    date: '2026-10-25',
    title: 'Comprehensive Metabolic Panel',
    status: 'normal',
    summary: 'All core biomarkers (Glucose, Creatinine, Electrolytes) are within normal reference ranges.',
  },
  {
    id: 'rep-002',
    date: '2026-10-10',
    title: 'Lipid Panel Test',
    status: 'attention',
    summary: 'LDL Cholesterol is slightly elevated. Recommended dietary adjustment and re-test in 3 months.',
  },
];

export const mockReportService = {
  uploadAndAnalyze: async (imageUri: string, onProgress?: (progress: number) => void) => {
    // Simulate upload progress chunks
    if (onProgress) {
      onProgress(25);
      await delay(300);
      onProgress(60);
      await delay(300);
      onProgress(100);
      await delay(200);
    } else {
      await delay(800);
    }

    // Create a new mock report from the upload
    const newReport: ReportItem = {
      id: `rep-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      title: 'Scanned Blood Test Report',
      status: 'normal',
      summary: 'Automated OCR analysis completed successfully. Key metrics look stable.',
    };

    mockReports.unshift(newReport); // Add to top of list
    return { success: true, message: 'Analyzed successfully', report: newReport };
  },

  getHistory: async (): Promise<ReportItem[]> => {
    await delay(500);
    return mockReports;
  },

  getReportDetails: async (reportId: string) => {
    await delay(500);
    
    // Return detailed metrics including trend chart data
    return {
      id: reportId,
      title: reportId === 'rep-002' ? 'Lipid Panel Test' : 'Comprehensive Metabolic Panel',
      date: '2026-10-10',
      summary: 'Detailed biomarker analysis breakdown for your review.',
      unit: 'mg/dL',
      trendData: [
        { value: 180, label: 'Jan' },
        { value: 165, label: 'Apr' },
        { value: 190, label: 'Jul' },
        { value: 155, label: 'Oct' },
      ],
    };
  },
};