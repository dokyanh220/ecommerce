'use client'

import { Categories } from "./categories"
import { SearchInput } from "./search-input"
import { useTRPC } from "~/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query"

export const SearchFilter = () => {
  // Sử dụng Custom Hook Pattern với tRPC! Đây là cách để chia sẻ data giữa nhiều component mà không cần truyền props.
  const trpc = useTRPC()
  const { data } = useSuspenseQuery(trpc.categories.getMany.queryOptions())

  return (
    <div className="px-4 lg:px-12 py-8 border-b flex flex-col gap-4 w-full" style={{
      backgroundColor: '#f5f5f5'
    }}>
      <SearchInput />     
      <div className="hidden lg:block">
        <Categories/>
      </div>
    </div>
  )
}

export const SearchFilterLoading = () => {
  return (
    <div className="px-4 lg:px-12 py-8 border-b flex flex-col gap-4 w-full" style={{
      backgroundColor: '#f5f5f5'
    }}>
      <SearchInput disabled />     
      <div className="hidden lg:block">
        <div className="h-10"/>
      </div>
    </div>
  )
}