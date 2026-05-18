"use client"
import { useSuspenseInfiniteQuery } from "@tanstack/react-query"
import { useTRPC } from "~/trpc/client"
import { useProductFilters } from "../../hooks/use-product-filter"
import { ProductCard, ProductCardSkeleton } from "./product-card"
import { DEFAULT_TAGS_LIMIT } from "~/constants"
import { Button } from "~/components/ui/button"
import { InboxIcon } from "lucide-react"

interface Props{
  category?: string
}

export const ProductList = ({ category }: Props) => {
  const [filters] = useProductFilters()

  const trpc = useTRPC()
  // useSuspenseQuery fecth dữ liệu và auto state loading khi không có dữ liệu
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } = useSuspenseInfiniteQuery(trpc.products.getMany.infiniteQueryOptions(
    {
      category,
      ...filters,
      limit: DEFAULT_TAGS_LIMIT
    },
    {
      getNextPageParam: (lastPage) => {
        return lastPage.docs.length > 0 ? lastPage.nextPage : undefined
      }
    }
  ))

  if (data.pages?.[0]?.docs.length == 0) {
    return (
      <div className="border border-dashed border-black flex items-center justify-center p-8 flex-col gap-y-4 bg-white w-full rounded-lg">
        <InboxIcon />
        <p className="text-base font-medium">No products found</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {data?.pages.flatMap(page => page.docs).map(product => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            imageUrl={product.image?.url}
            price={product.price}
            authorName="dokyanh"
            authorImageUrl={undefined}
            reviewRating={4.8}
            reviewCount={5}
          />
        ))}
      </div>

      <div className="flex justify-center pt-8">
        {hasNextPage && (
          <Button
            disabled={isFetchingNextPage}
            onClick={() => fetchNextPage()}
            className="font-medium disabled:opacity-50 text-base bg-white"
            variant="elevated"
          >
            Load more
          </Button>
        )}
      </div>
    </>
  )
}

export const ProductListSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
      {Array.from({ length: DEFAULT_TAGS_LIMIT }).map((_, index) => (
        <ProductCardSkeleton key={index}/>
      ))}
    </div>
  )
}