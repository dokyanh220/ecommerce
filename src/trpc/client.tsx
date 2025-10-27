'use client'
// ^-- Đảm bảo file chạy phía client để dùng React hook
import type { QueryClient } from '@tanstack/react-query'
import { QueryClientProvider } from '@tanstack/react-query'
import { createTRPCClient, httpBatchLink } from '@trpc/client'
import { useState } from 'react'
import { makeQueryClient } from './query-client'
import type { AppRouter } from './routers/_app'
import { createTRPCContext } from '@trpc/tanstack-react-query'
import superjson from 'superjson'
import { env } from '~/config/environment'

// Tạo context cho tRPC
export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>()

let browserQueryClient: QueryClient

// Hàm khởi tạo QueryClient, phân biệt server và client
function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: tạo query client mới cho mỗi request để tránh chia sẻ state
    return makeQueryClient()
  }
  // Client: tái sử dụng singleton để giữ cache giữa các render
  if (!browserQueryClient) browserQueryClient = makeQueryClient()
  return browserQueryClient
}

// Hàm hỗ trợ trong server-side để lấy query options từ tRPC
function getUrl() {
  const base = typeof window === 'undefined' ? env.NEXT_PUBLIC_APP_URL : ''
  return `${base ?? ''}/api/trpc`
}

// Provider component để bọc ứng dụng, cung cấp context cho React Query và tRPC
export function TRPCReactProvider(
  props: Readonly<{
    children: React.ReactNode
  }>,
) {
  // Khởi tạo client một lần giúp React Query và tRPC chia sẻ cache hiệu quả
  const queryClient = getQueryClient()
  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
          transformer: superjson,
          url: getUrl(),
        }),
      ],
    }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {props.children}
      </TRPCProvider>
    </QueryClientProvider>
  )
}