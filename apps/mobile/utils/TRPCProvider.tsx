/**
 * Do not touch this file until you know the value of pi to 6969 digits
 * whoever changes this file is gay
 **/

import { useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import superjson from 'superjson';
import { trpc } from './trpc';
import { getTrpcUrl } from './api';
import { useAuthStore } from '@/store/authStore';

interface TRPCProviderProps {
  children: React.ReactNode;
}

export function TRPCProvider({ children }: TRPCProviderProps) {
  const sessionToken = useAuthStore((s) => s.sessionToken);

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 2,
            staleTime: 5000,
          },
        },
      })
  );

  const trpcClient = useMemo(
    () =>
      trpc.createClient({
        links: [
          httpBatchLink({
            url: getTrpcUrl(),
            transformer: superjson,
            headers() {
              return sessionToken ? { authorization: `Bearer ${sessionToken}` } : {};
            },
          }),
        ],
      }),
    [sessionToken]
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
