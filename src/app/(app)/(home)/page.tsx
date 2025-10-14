"use client"

import { useQuery } from "@tanstack/react-query"
import { useTRPC } from "~/trpc/client"

export default function Home () {
  // Khởi tạo queryClient/TRPC client
  const trpc = useTRPC()
  // Sử dụng hook useQuery để gọi procedure getMany trong categories router, query options được lấy từ server
  const categories = useQuery(trpc.categories.getMany.queryOptions())
  return (
    <div>
      <p>is loading: {`${categories.isLoading}`} </p>
      {JSON.stringify(categories.data, null, 2)}
    </div>
  )
}