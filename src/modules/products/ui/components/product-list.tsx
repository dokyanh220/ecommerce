"use client"
import { useSuspenseQuery } from "@tanstack/react-query"
import { useTRPC } from "~/trpc/client"
import { useProductFilters } from "../../hooks/use-product-filter"
import { ProductCard } from "./product-card"

interface Props{
  category?: string
}

export const ProductList = ({ category }: Props) => {
  const [filters] = useProductFilters()

  const trpc = useTRPC()
  // useSuspenseQuery fecth dữ liệu và auto state loading khi không có dữ liệu
  const { data } = useSuspenseQuery(trpc.products.getMany.queryOptions({
    category,
    ...filters
  }))

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
      {data?.docs.map(product => (
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
  )
}

export const ProductListSkeleton = () => {
  return (
    <div>
      Loading...
    </div>
  )
}