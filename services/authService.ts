import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';
import { apiClient } from './api/client';

const TOKEN_KEY = 'user_jwt_token';
const USE_MOCK = process.env.EXPO_PUBLIC_USE_MOCK === 'true';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const authService = {
  /**
   * Log in user (supports mock mode or real server API)
   */
  login: async (email: string, password: string) => {
    if (USE_MOCK) {
      await delay(800);
      if (!email || !password) {
        throw new Error('Please enter both email and password.');
      }
      
      const fakeToken = 'mock-jwt-token-123456';
      await SecureStore.setItemAsync(TOKEN_KEY, fakeToken);
      return { 
        success: true, 
        token: fakeToken, 
        user: { email, name: 'Demo Patient' } 
      };
    }

    const response = await apiClient.post('/auth/login', { email, password });
    if (response.data?.token) {
      await SecureStore.setItemAsync(TOKEN_KEY, response.data.token);
    }
    return response.data;
  },

  /**
   * Register new user account
   */
  register: async (email: string, password: string, name: string) => {
    if (USE_MOCK) {
      await delay(800);
      const fakeToken = 'mock-jwt-token-123456';
      await SecureStore.setItemAsync(TOKEN_KEY, fakeToken);
      return { 
        success: true, 
        token: fakeToken, 
        user: { email, name } 
      };
    }

    const response = await apiClient.post('/auth/register', { email, password, name });
    if (response.data?.token) {
      await SecureStore.setItemAsync(TOKEN_KEY, response.data.token);
    }
    return response.data;
  },

  /**
   * Log out user and clear token storage
   */
  logout: async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    
    if (!USE_MOCK) {
      try {
        await apiClient.post('/auth/logout');
      } catch (error) {
        console.error('Server logout error:', error);
      }
    }
  },

  /**
   * Retrieve active JWT token
   */
  getToken: async (): Promise<string | null> => {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  },

  /**
   * Biometric unlock (Face ID / Fingerprint)
   */
  authenticateWithBiometrics: async (): Promise<boolean> => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) return true;

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Unlock Medical Report Vault',
        fallbackLabel: 'Use Device Passcode',
      });

      return result.success;
    } catch (error) {
      console.error('Biometric auth error:', error);
      return false;
    }
  },
};