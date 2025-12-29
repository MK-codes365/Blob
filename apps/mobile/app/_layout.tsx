import '../global.css';

import { Slot } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { useColorScheme } from 'nativewind';
import { useEffect } from 'react';

import { TRPCProvider } from '@/utils/TRPCProvider';
import { useAuthStore } from '@/store/authStore';

export default function RootLayout() {
  const { colorScheme } = useColorScheme(); // nativewind hook

  useEffect(() => {
    void useAuthStore.getState().hydrate();
  }, []);

  return (
    <SafeAreaProvider>
      <TRPCProvider>
        <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
        <Slot />
      </TRPCProvider>
    </SafeAreaProvider>
  );
}
