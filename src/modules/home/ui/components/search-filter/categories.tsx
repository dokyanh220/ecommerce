"use client"

import { useEffect, useRef, useState } from 'react'
import { CategoryDropDown } from './categoryDropDown'
import { CategorySidebar } from './categorySidebar'
import { Button } from '~/components/ui/button'
import { ListFilterIcon } from 'lucide-react'
import { cn } from '~/lib/utils'
// import { useTRPC } from '~/trpc/client'
// import { useSuspenseQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { CategoriesGetManyOutput } from '~/modules/categories/types'

interface Props {
  data: CategoriesGetManyOutput
}

export const Categories = ({ data }: Props) => {
  const params = useParams() 
  // const trpc = useTRPC()
  // const { data } = useSuspenseQuery(trpc.categories.getMany.queryOptions())

  const containerRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLDivElement>(null)
  const viewAllRef = useRef<HTMLDivElement>(null)

  // visibleCount là số lượng category hiển thị được theo chiều rộng của container, mặc định là hiển thị tất cả các category
  // nếu `containerRef.current`, `viewAllRef.current` và `measureRef.current` khác null thì tính toán lại visibleCount
  const [visibleCount, setVisibleCount] = useState(data.length)
  // Theo dõi category được hover
  const [isAnyHovered, setIsAnyHovered] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const categoryParam = params.category as string | undefined
  // activeCategory là category hiện tại người dùng đang chọn
  // Ví dụ: người dùng đang chọn /category/all thì activeCategory = 'all'
  // Nếu người dùng đang chọn /category/products thì activeCategory = 'products'
  // Mặc định không có category nào được chọn thì activeCategory = 'all'
  const activeCategory = categoryParam || 'all'
  // activeCategoryIndex là vị trí index của category hiện tại trong data
  const activeCategoryIndex = data.findIndex((category) => category.slug === activeCategory)
  // isActiveCategoryHidden là category hiện tại có bị ẩn hay không
  // Nếu activeCategoryIndex >= visibleCount thì category hiện tại bị ẩn
  // Nếu activeCategoryIndex < visibleCount thì category hiện tại không bị ẩn
  const isActiveCategoryHidden = activeCategoryIndex >= visibleCount && activeCategoryIndex !== -1
  
  useEffect(() => {
    // Hàm tính toán số lượng category hiển thị trong container
    const calculateVisibleCount = () => {
      // Nếu 3 ref này không tồn tại thì return
      if (!containerRef.current || !measureRef.current || !viewAllRef.current) return

      const containerWidth = containerRef.current.offsetWidth
      // Chiều rộng của button "View All"
      const viewAllWidth = viewAllRef.current.offsetWidth
      // availableWidth là chiều rộng còn lại sau khi trừ đi chiều rộng của button "View All"
      const availableWidth = containerWidth - viewAllWidth

      const items = Array.from(measureRef.current.children)
      // Tính toán số lượng category có thể hiển thị được trong chiều rộng availableWidth
      let totalWidth = 0
      let visible = 0

      // Đếm số item hiển thị vừa với container
      for (const item of items) {
        const width = item.getBoundingClientRect().width

        
        // Nếu thêm item này vào sẽ vượt quá availableWidth thì dừng
        if (totalWidth + width > availableWidth) break
        totalWidth += width
        visible++
      }

      setVisibleCount(visible)
    }
    
    // resizeObserver là đối tượng quan sát thay đổi của containerRef
    const resizeObserver = new ResizeObserver(calculateVisibleCount)
    resizeObserver.observe(containerRef.current!) // ! để cho TS biết khác null

    // Trả về disconnect để hủy khi component ngưng sử dụng
    return () => resizeObserver.disconnect()
  }, [data.length])
   
  return (  
    <div className='relative w-full'>
      {/* Categories sidebar */}
      {isSidebarOpen && (
        <CategorySidebar data={data} open={isSidebarOpen} onOpenChange={setIsSidebarOpen} />
      )}

      {/* Ẩn category container không chứa đủ */}
      <div
        ref={measureRef}
        className='absolute opacity-0 pointer-events-none flex'
        style={{ position: 'fixed', top: -9999, left: -9999 }}
      >
        {data.map((category) => (
            <div key={category.id} >
              <CategoryDropDown
                category={category}
                isActive={activeCategory === category.slug}
                isNavigationHovered={false}
              />
            </div>
        ))}
      </div>

      {/* Visible items */}
      <div
        ref={containerRef}
        className='flex flex-nowrap items-center'
        onMouseEnter={() => setIsAnyHovered(true)}
        onMouseLeave={() => setIsAnyHovered(false)}
      >
        {data.slice(0, visibleCount).map((category) => (
            <div key={category.id} >
              <CategoryDropDown
                category={category}
                isActive={activeCategory === category.slug} // isActive cho biét category nào đang được chọn
                isNavigationHovered={isAnyHovered}
              />
            </div>
        ))}

        {/* Nhật ký: để nút view all bên ngoài để rồi viewAllRef === containerRef mò lòi lol */}
        <div
          className='shrink-0'
          ref={viewAllRef}
        >
          <Button
            className={cn(
              'h-11 px-4 rounded-full bg-transparent border border-transparent text-black hover:border-primary hover:bg-white z-50',
              isActiveCategoryHidden && !isAnyHovered && 'bg-white border-primary'
            )}
            onClick={() => setIsSidebarOpen(true)}
          >
            View all
            <ListFilterIcon className='ml-2' />
          </Button>
        </div>
      </div>
    </div>
  )
}