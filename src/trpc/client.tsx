'use client';
// ^-- Đảm bảo file chạy phía client để dùng React hook
import type { QueryClient } from '@tanstack/react-query';
import { QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { makeQueryClient } from './query-client';
import type { AppRouter } from './routers/_app';

// Tạo instance trpc để tái sử dụng khắp ứng dụng
export const trpc = createTRPCReact<AppRouter>();

let browserQueryClient: QueryClient;

function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: tạo query client mới cho mỗi request để tránh chia sẻ state
    return makeQueryClient();
  }
  // Client: tái sử dụng singleton để giữ cache giữa các render
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}

function getUrl() {
  const base = typeof window === 'undefined' ? process.env.NEXT_PUBLIC_APP_URL : '';
  return `${base ?? ''}/api/trpc`;
}

type TRPCReactProviderProps = Readonly<{ children: ReactNode }>;

export function TRPCReactProvider({ children }: TRPCReactProviderProps) {
  // Khởi tạo client một lần giúp React Query và tRPC chia sẻ cache hiệu quả
  const queryClient = getQueryClient();
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          // transformer: superjson, <-- bật khi cần serialization nâng cao
          url: getUrl(),
        }),
      ],
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}