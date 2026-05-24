import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { DEFAULT_TAGS_LIMIT } from "~/constants"
import { loadProductFilters } from "~/modules/products/search-params"
import { ProductListView } from "~/modules/products/ui/views/product-list-view"
import { getQueryClient, trpc } from "~/trpc/server"

interface Props {
  params: Promise<{
    category: string
  }>
  searchParams: Promise<{
    minPrice: string | undefined,
    maxPrice: string | undefined
    tags: string | undefined
  }>
}
const Page = async ({ params, searchParams }: Props) => {
  const { category } = await params
  const filters = await loadProductFilters(searchParams)

  const queryClient = await getQueryClient()
  void queryClient.prefetchInfiniteQuery(trpc.products.getMany.infiniteQueryOptions({
    category,
    ...filters,
    limit: DEFAULT_TAGS_LIMIT
  }))

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductListView category={category}/>
    </HydrationBoundary>
  )
}

export default Page