import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { ProductsList } from "~/modules/products/ui/components/products-list"
import { getQueryClient, trpc } from "~/trpc/server"

interface Props{
  params: Promise<{
    category: string
  }>
}
const Page = async ({ params }: Props) => {
  const queryClient = await getQueryClient()
  void queryClient.prefetchQuery(trpc.products.getMany.queryOptions())

  return ( 
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductsList />
    </HydrationBoundary>
   )
}
 
export default Page