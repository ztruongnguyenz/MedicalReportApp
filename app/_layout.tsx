import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';
import { LanguageProvider, useLanguage } from '@/context/LanguageContext';
import LanguageToggle from '@/components/LanguageToggle';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  anchor: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <LanguageProvider>
      <RootLayoutNav />
    </LanguageProvider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { t } = useLanguage();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        {/* Main Tabs */}
        <Stack.Screen 
          name="(tabs)" 
          options={{ 
            headerShown: false
          }} 
        />
        
        {/* Login Screen */}
        <Stack.Screen 
          name="login" 
          options={{ 
            headerShown: true, 
            title: '',
            headerRight: () => <LanguageToggle />,
          }} 
        />

        {/* Register Screen - Bổ sung Header & LanguageToggle giống Login */}
        <Stack.Screen 
          name="register" 
          options={{ 
            headerShown: true, 
            title: '',
            headerRight: () => <LanguageToggle />,
          }} 
        />

        {/* Forgot Password Screen - Bổ sung Header & LanguageToggle giống Login */}
        <Stack.Screen 
          name="forgot-password" 
          options={{ 
            headerShown: true, 
            title: '',
            headerRight: () => <LanguageToggle />,
          }} 
        />
        
        {/* Dynamic Report Details Screen - Dùng i18n thay vì fix cứng text */}
        <Stack.Screen 
          name="report/[id]" 
          options={{ 
            headerShown: true, 
            title: t('reportDetails') || 'Report Details',
            headerRight: () => <LanguageToggle />,
          }} 
        />
      </Stack>
    </ThemeProvider>
  );
}