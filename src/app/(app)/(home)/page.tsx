"use client"

import { useQuery } from "@tanstack/react-query"
import { useTRPC } from "~/trpc/client"

export default function Home () {
  // Khởi tạo queryClient/TRPC client
  const trpc = useTRPC()
  const { data } = useQuery(trpc.auth.session.queryOptions())
  
  return (
    <div>
      {JSON.stringify(data?.user, null, 2)}
    </div>
  )
}