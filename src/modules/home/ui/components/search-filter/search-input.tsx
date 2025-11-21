"use client"

import { BookmarkCheckIcon, ListFilterIcon, SearchIcon } from "lucide-react"
import { Input } from "~/components/ui/input"
import { CategorySidebar } from './categorySidebar'
import { useState } from "react"
import { useTRPC } from "~/trpc/client"
import { useQuery } from "@tanstack/react-query"
import { Button } from "~/components/ui/button"
import Link from "next/link"

interface Props {
  disabled?: boolean
  // data: CustomCategory[]
}

export const SearchInput = ({
  disabled,
  // data
}: Props) => {
  const trpc = useTRPC()
  const session = useQuery(trpc.auth.session.queryOptions())

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

      {session.data?.user && (
        <Button
          asChild
          variant='elevated'
        >
          <Link href='/library'>
            <BookmarkCheckIcon />
            Library
          </Link>
        </Button>
      )}
    </div>
  )
}