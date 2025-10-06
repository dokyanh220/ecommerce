"use client"

import { useEffect, useRef, useState } from 'react'
import { CategoryDropDown } from './categoryDropDown'
import { CustomCategory } from '../types'

interface Props {
  data: CustomCategory[]
}

export const Categories = ({ data }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLDivElement>(null)
  const viewAllRef = useRef<HTMLDivElement>(null)

  // visibleCount là số lượng category hiển thị được theo chiều rộng của container, mặc định là hiển thị tất cả các category
  // nếu `containerRef.current`, `viewAllRef.current` và `measureRef.current` khác null thì tính toán lại visibleCount
  const [visibleCount, setVisibleCount] = useState(data.length)
  const [isAnyHovered, setIsAnyHovered] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // activeCategory là category hiện tại người dùng đang chọn
  // Ví dụ: người dùng đang chọn /category/all thì activeCategory = 'all'
  // Nếu người dùng đang chọn /category/products thì activeCategory = 'products'
  // Mặc định không có category nào được chọn thì activeCategory = 'all'
  const activeCategory = 'all'
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
      // avalibleWidth là chiều rộng còn lại sau khi trừ đi chiều rộng của button "View All"
      const avalibleWidth = containerWidth - viewAllWidth

      const items = Array.from(measureRef.current.children)
      // Tính toán số lượng category có thể hiển thị được trong chiều rộng avalibleWidth
      let totalWidth = 0
      let visible = 0

      for (const item of items) {
        const itemWidth = item.getBoundingClientRect().width

        // Nếu tổng của các button <= avalibleWidth, break
        if (totalWidth + itemWidth <= avalibleWidth) break
        totalWidth += itemWidth
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

     <div className='flex flex-nowrap items-center'>
       {data.map((category) => (
          <div key={category.id} >
            <CategoryDropDown
              category={category}
              isActive={activeCategory === category.slug} // isActive cho biét category nào đang được chọn
              isNavigationHovered={false}
            />
          </div>
       ))}
     </div>
    </div>
  )
}