"use client"

import { useRef, useState } from 'react'

import { cn } from '~/lib/utils'
import { Button } from '~/components/ui/button'
import { useDropdownPostion } from './use-dropdown-postion'
import { SubcategoryMenu } from './subcategoryMenu'
import { CustomCategory } from '../types'

interface Props {
  category: CustomCategory,
  isActive?: boolean,
  isNavigationHovered?: boolean,
}

export const CategoryDropDown = ({
  category,
  isActive,
  isNavigationHovered
}: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const onMouseEnter = () => {
    if (category.subcategories) {
      setIsOpen(true)
    }
  }

  const onMouseLeave = () => setIsOpen(false)

  const { getDropdownPosition } = useDropdownPostion(dropdownRef)

  const dropdownPosition = getDropdownPosition()

  return (
    <div
      className='relative'
      ref={dropdownRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className='relative'>
        <Button
          variant='elevated'
          className={cn(
            'h-11 px-4 rounded-full bg-transparent border border-transparent text-black hover:border-primary hover:bg-white z-50',
            isActive && isNavigationHovered && 'bg-white border-primary',
            isOpen && 'bg-white border-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-1 transition-all'
          )}
        >
          {category.name}
        </Button>
        {/* Nếu categories.length > 0 thì mới hiện dropdown */}
        {category.subcategories && category.subcategories.length > 0 && (
          <div
            className={cn(
              'opacity-0 absolute -bottom-3 w-0 h-0 border-l-[10px] border-r-[10px] border-b-[10px] border-l-transparent border-r-transparent border-b-black left-1/2 -translate-x-1/2',
              isOpen && 'opacity-100' 
            )}
          />
        )}
      </div>

      <SubcategoryMenu
        category={category}
        isOpen={isOpen}
        position={dropdownPosition}
      />
    </div>
  )
}