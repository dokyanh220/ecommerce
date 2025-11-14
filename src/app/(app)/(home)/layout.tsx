import { Navbar } from '~/modules/home/ui/components/Navbar'
import { SearchFilter, SearchFilterLoading } from '~/modules/home/ui/components/search-filter'
import { getQueryClient, trpc } from '~/trpc/server'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { Suspense } from 'react'
import Footer from '~/modules/home/ui/components/footer/page'


// Định nghĩa kiểu props cho component Layout
interface Props {
  children: React.ReactNode // Các component con sẽ được render bên trong layout
}

// Component Layout chính - server component để fetch dữ liệu từ PayloadCMS
const Layout = async ({ children }: Props) => {
  const queryClient = getQueryClient()
  void queryClient.prefetchQuery(
    trpc.categories.getMany.queryOptions()
  );

  return ( 
    <div className="flex flex-col min-h-screen">
      {/* Header navigation với logo và menu */}
      <Navbar />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<SearchFilterLoading />}>
          {/* Thanh tìm kiếm và bộ lọc danh mục */}
          <SearchFilter />
        </Suspense>
      </HydrationBoundary>
      
      {/* Nội dung chính - flex-1 để chiếm toàn bộ không gian còn lại */}
      <div className='flex-1 justify-center bg-[#f4f4f0]'>
        {children} {/* Render các trang con như home, about, contact... */}
      </div>
      
      {/* Footer chứa thông tin liên hệ và links */}
      <Footer />
    </div>
  )
}
 
export default Layout