"use client"

import { useEffect, useRef, useState } from 'react'
import { CategoryDropDown } from './categoryDropDown'
import { CustomCategory } from '../types'

interface Props {
  data: CustomCategory[]
}

export const Categories = ({ data }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const messureRef = useRef<HTMLDivElement>(null)
  const viewAllRef = useRef<HTMLDivElement>(null)

  const [visibleCount, setVisibleCount] = useState(data.length)
  const [isAnyHovered, setIsAnyHovered] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const activeCategory = 'all'
  
  useEffect(() => {

  }, [])
   
  return (  
    <div className='relative w-full'>

     <div className='flex flex-nowrap items-center'>
       {data.map((category) => (
          <div key={category.id} >
            <CategoryDropDown
              category={category}
              isActive={false}
              isNavigationHovered={false}
            />
          </div>
       ))}
     </div>
    </div>
  )
}