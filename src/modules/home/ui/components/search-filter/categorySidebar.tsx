import { Sheet, SheetContent, SheetHeader, SheetTitle } from '~/components/ui/sheet'
import { useState } from 'react'
import { ScrollArea } from '@radix-ui/react-scroll-area'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { CategoriesGetManyOutput } from '~/modules/categories/types'
// import { useTRPC } from '~/trpc/client'
// import { useSuspenseQuery } from '@tanstack/react-query'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  // Dữ liệu categories (mảng category). Nếu chưa có có thể truyền [] để đơn giản hóa logic.
  data: CategoriesGetManyOutput
}

export const CategorySidebar = ({
  open,
  onOpenChange,
  data
}: Props) => {
  // const trpc = useTRPC()
  // const { data } = useSuspenseQuery(trpc.categories.getMany.queryOptions())
  const router = useRouter()

  // Element type (mỗi phần tử của mảng): lấy bằng typeof data[number] thay vì chỉ số [1]
  // Mỗi category có thể có subcategories (mảng con) hoặc undefined (lá cuối)
  interface CategoryItem {
    id: string
    name: string
    slug: string
    color?: string | null
    // parent có thể là id (string) hoặc CategoryItem (tùy vào depth mà Payload trả về)
    parent?: string | CategoryItem | null
    updatedAt: string
    createdAt: string
    subcategories?: CategoryItem[] // optional
  }

  // Danh mục con của danh mục đang chọn (nếu có)
  const [parentCategories, setParentCategories] = useState<CategoryItem[] | null>(null)
  // Danh mục đang được chọn để drill-down
  const [selectedCategory, setSelectedCategory] = useState<CategoryItem | null>(null)

  // Nếu có danh mục cha, hiển thị danh mục con [parentCategory.children]
  // Nếu không có danh mục cha, hiển thị danh mục gốc [data]
  const currentCategories = parentCategories ?? data ?? []

  const handleOpenChange = (open: boolean) => {
    setParentCategories(null)
    setSelectedCategory(null)
    onOpenChange(open)
  }

  const handleCategoryClick = (category: CategoryItem) => {
    // Nếu category có subcategories thì mở danh mục con
    if (category.subcategories && category.subcategories.length > 0) {
      // Không ép kiểu: subcategories đã đúng là CategoryItem[] | undefined
      // subcategories hiện là CategoryItem[] | undefined → đã được khai báo optional
      setParentCategories(category.subcategories ?? null)
      setSelectedCategory(category)
    } else {
      // Đây là category con, chuyển hướng tới trang category
      if (parentCategories && selectedCategory) {
        // thực hiện chuyển hướng tới trang category với slug của category
        router.push(`/${selectedCategory.slug}/${category.slug}`)
      } else { // Với category gốc
        router.push(category.slug === 'all' ? '/' : `/${category.slug}`)
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