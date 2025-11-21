import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { Suspense } from "react"
import { ProductFilters } from "~/modules/products/ui/components/product-filters"
import { ProductList, ProductListSkeleton } from "~/modules/products/ui/components/product-list"
import { getQueryClient, trpc } from "~/trpc/server"

interface Props{
  params: Promise<{
    category: string
  }>
  searchParams: Promise<{
    minPrice: string | undefined,
    maxPrice: string | undefined
  }>
}
const Page = async ({ params, searchParams }: Props) => {
  const { category } = await params
  const { minPrice, maxPrice} = await searchParams

  const queryClient = await getQueryClient()
  void queryClient.prefetchQuery(trpc.products.getMany.queryOptions({
    category,
    minPrice,
    maxPrice
  }))

  return ( 
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="px-4 lg:px-12 py-8 flex flex-col gap-4">
       <div className="grid grid-cols-1 lg:grid-cols-6 xl:grid-cols-8 gap-y-6 gap-x-12">
          <div className="lg:col-span-2 xl:col-span-2">
            <ProductFilters />
          </div>

          <div className="lg:col-span-4 xl:col-span-6">
            <Suspense fallback={<ProductListSkeleton />}>
              <ProductList category={category} />
            </Suspense>
          </div>
       </div>
      </div>
    </HydrationBoundary>
   )
}
 
export default Page