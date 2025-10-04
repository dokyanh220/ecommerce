import { Button } from '~/components/ui/button'
import { Category } from '~/payload-types'

interface Props {
  category: Category,
  isActive?: boolean,
  isNavigationHovered?: boolean,
}

export const CategoryDropDown = ({
  category,
  isActive,
  isNavigationHovered
}: Props) => {
  return (
    <Button>
      {category.name}
    </Button>
  )
}