import '../global.css';

import { Stack } from 'expo-router';
import { TRPCProvider } from '@/utils/TRPCProvider';

export default function Layout() {
  return (
    <TRPCProvider>
      <Stack />
    </TRPCProvider>
  );
}
