import { Category } from '~/payload-types'
import { CategoryDropDown } from './categoryDropDown'

interface Props {
  data: Category[]
}

export const Categories = ({ data }: Props) => {
  return (  
    <div>
     {data.map((category:  Category) => (
        <div key={category.id} >
          <CategoryDropDown
            category={category}
            isActive={false}
            isNavigationHovered={false}
          />
        </div>
     ))}
    </div>
  )
}