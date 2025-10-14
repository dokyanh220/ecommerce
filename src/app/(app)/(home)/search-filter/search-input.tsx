"use client"

import { ListFilterIcon, SearchIcon } from "lucide-react"
import { Input } from "~/components/ui/input"
import { CategorySidebar } from './categorySidebar'
import { useState } from "react"
import { Button } from "~/components/ui/button"
import { useTRPC } from "~/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query"

interface Props {
  disabled?: boolean,
  // data: CustomCategory[]/
}

export const SearchInput = ({
  disabled,
  // data
}: Props) => {
  const trpc = useTRPC()
  const { data } = useSuspenseQuery(trpc.categories.getMany.queryOptions())

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="flex items-center gap-2 w-full">
      <CategorySidebar open={isSidebarOpen} onOpenChange={setIsSidebarOpen} />
      <div className="relative w-full">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-500 "/>
        <Input className="pl-8" placeholder=" Search products" disabled={disabled} />
      </div>

      <Button
        variant='elevated'
        onClick={() => setIsSidebarOpen(true)}
        className="size-12 shrink-0 flex lg:hidden"
      >
        <ListFilterIcon />
      </Button>
    </div>
  )
}