"use client"

import { ChevronDownIcon, ChevronRightIcon } from "lucide-react"
import { useState } from "react"
import { cn } from "~/lib/utils"
import { PriceFilter } from "./price-filter"
import { useProductFilters } from "../../hooks/use-product-filter"

interface ProductFilterProps {
  title: string
  className?: string
  children: React.ReactNode
}

const ProductFilter = ({ title, className, children }: ProductFilterProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const Icon = isOpen ? ChevronDownIcon : ChevronRightIcon

  return (
    <div className={cn(
      "p-4 border-b flex flex-col gap-2",
      className
    )}>
      <div
        onClick={() => setIsOpen(curr => !curr)}
        className="flex items-center justify-between cursor-pointer"
      >
        <p className="font-medium">{title}</p>
        <Icon className={cn(
          "size-5 transition-transform duration-300",
          isOpen && "rotate-0"
        )} />
      </div>

      <div
        className={cn(
          "grid transition-all duration-300 ease-in-out",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  )
}

export const ProductFilters = () => {
  const [filters, setFilters] = useProductFilters()

  const hasAnyFilters = Object.entries(filters).some(([key, value]) => {
    if (typeof value === 'string') return value !== ''
    return value !== null
  })

  const onChange = (key: keyof typeof filters, value: unknown) => {
    setFilters({ ...filters, [key]: value })
  }

  const onClear = () => {
    setFilters({
      minPrice: '',
      maxPrice: ''
    })
  }

  return (
    <div className="border rounded-md bg-white">
      <div className="p-4 border-b flex items-center justify-between">
        <p className="font-medium">Filters</p>
        {hasAnyFilters && (
          <button className="text-[14px] underline cursor-pointer" onClick={onClear} type="button">
            Clear
          </button>
        )}
      </div>
      <ProductFilter title="Price" className="border-b-0">
        <PriceFilter
          minPrice={filters.minPrice}
          maxPrice={filters.maxPrice}
          onMinPriceChange={value => onChange('minPrice', value)}
          onMaxPriceChange={value => onChange('maxPrice', value)}
        />
      </ProductFilter>
    </div>
  )
}