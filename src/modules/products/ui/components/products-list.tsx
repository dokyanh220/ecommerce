"use client"
import { useSuspenseQuery } from "@tanstack/react-query"
import { useTRPC } from "~/trpc/client"

export const ProductsList = () => {
  const trpc = useTRPC()
  // useSuspenseQuery fecth dữ liệu và auto state loading khi không có dữ liệu
  const { data } = useSuspenseQuery(trpc.products.getMany.queryOptions())

  return (
    <div>
      {JSON.stringify(data, null, 2)}
    </div>
  )
}