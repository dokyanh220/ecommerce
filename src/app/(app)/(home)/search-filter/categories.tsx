import { CategoryDropDown } from './categoryDropDown'
import { CustomCategory } from '../types'

interface Props {
  data: CustomCategory[]
}

export const Categories = ({ data }: Props) => {
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