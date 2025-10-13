import { Sheet, SheetContent, SheetHeader, SheetTitle } from '~/components/ui/sheet';
import { CustomCategory } from '../types'
import { useState } from 'react';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: CustomCategory[]
}

export const CategorySidebar = ({
  open,
  onOpenChange,
  data
}: Props) => {
  const router = useRouter()

  // parentCategories là các danh mục con của danh mục cha được chọn
  const [parentCategories, setParentCategories] = useState<CustomCategory[] | null>(null)
  // selectedCategory là danh mục cha được chọn
  const [selectedCategory, setSelectedCategory] = useState<CustomCategory | null>(null)

  // Nếu có danh mục cha, hiển thị danh mục con [parentCategory.children]
  // Nếu không có danh mục cha, hiển thị danh mục gốc [data]
  const currentCategories = parentCategories ?? data ?? []

  const handleOpenChange = (open: boolean) => {
    setParentCategories(null)
    setSelectedCategory(null)
    onOpenChange(open)
  }

  const handleCategoryClick = (category: CustomCategory) => {
    // Nếu category có subcategories thì mở danh mục con
    if (category.subcategories && category.subcategories.length > 0) {
      // as CustomCategory[] vì subcategories có thể là undefined
      setParentCategories(category.subcategories as CustomCategory[])
      setSelectedCategory(category)
    } else {
      // Đây là category con, chuyển hướng tới trang category
      if (parentCategories && selectedCategory) {
        // thực hiện chuyển hướng tới trang category với slug của category
        router.push(`/${selectedCategory.slug}/${category.slug}`)
      } else { // Với category gốc
        if (category.slug === 'all') {
          router.push(`/`)
        } else {
          router.push(`/${category.slug}`)
        }
      }
      handleOpenChange(false)
    }
  }

  const handleBackClick = () => {
    if (parentCategories && selectedCategory) {
      setParentCategories(null)
      setSelectedCategory(null)
    }
  }

  const backgroundColor = selectedCategory?.color || 'white'
 return (
  <Sheet open={open} onOpenChange={handleOpenChange}>
    <SheetContent
      side='left'
      className='p-0 transition-none'
      style={{ backgroundColor }}
    >
      <SheetHeader className='p-4 border-b' >
        <SheetTitle>Categories</SheetTitle>
      </SheetHeader>

      <ScrollArea className='flex flex-col overflow-y-auto h-full pb-2'>
        {parentCategories && (
          <button
            onClick={() => {handleBackClick()}}
            className='w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium'
          >
            <ChevronLeftIcon className='size-4 mr-2' />
            Back
          </button>
        )}
        {currentCategories.map((category) => (
          <button
            key={category.slug}
            onClick={() => handleCategoryClick(category)}
            className='w-full text-left p-4 hover:bg-black hover:text-white flex justify-between items-center text-base font-medium'
          >
            {category.name}
            {category.subcategories && category.subcategories.length > 0 && (
              <ChevronRightIcon className='size-4' />
            )}
          </button>  
        ))}
      </ScrollArea>
    </SheetContent>
  </Sheet>
 ) 
}