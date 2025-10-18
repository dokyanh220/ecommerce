"use client"

import { useQuery } from "@tanstack/react-query"
import { useTRPC } from "~/trpc/client"

export default function Home () {
  // Khởi tạo queryClient/TRPC client
  const trpc = useTRPC()
  const { data } = useQuery(trpc.auth.session.queryOptions())
  
  return (
    <div>
      <h1>Home page</h1>
      {JSON.stringify(data, null, 2)}
    </div>
  )
}