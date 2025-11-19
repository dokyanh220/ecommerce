import { ChangeEvent } from "react"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"

interface Props {
  minPrice?: string | null
  maxPrice?: string | null
  onMinPriceChange: (value: string) => void
  onMaxPriceChange: (value: string) => void
}

export const formatAsCurrency = (value: string) => {
  // Bước 1: Loại bỏ tất cả ký tự KHÔNG phải số
  const numericValue = value.replace(/[^0-9]/g, '')
  
  // Bước 2: Tách phần nguyên và phần thập phân
  const parts = numericValue.split('.')
  
  // Bước 3: Format lại - giữ phần nguyên + tối đa 2 chữ số thập phân
  const formattedValue =
    parts[0] + (parts.length > 1 ? '.' + parts[1]?.slice(0, 2) : '')

  // Bước 4: Nếu chuỗi rỗng → return rỗng (code bị thiếu)
  if(!formattedValue) return ''

  const numberValue = parseFloat(formattedValue)
  if (isNaN(numberValue)) return ''

  return new Intl.NumberFormat('en-US', {
    style: 'currency',           // Định dạng kiểu tiền tệ
    currency: 'USD',             // Loại tiền: US Dollar
    minimumFractionDigits: 0,    // Tối thiểu 0 chữ số thập phân
    maximumFractionDigits: 2     // Tối đa 2 chữ số thập phân
  }).format(numberValue)
}

export const PriceFilter = ({
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange
}: Props) => {
  const handleMinPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/[^0-9]/g, '')
    onMinPriceChange(numericValue)
  }
  const handleMaxPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/[^0-9]/g, '')
    onMaxPriceChange(numericValue)
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        <Label className='font-medium text-base'>
          Minimum price
        </Label>
        <Input
          type="text"
          placeholder="$0"
          value={minPrice ? formatAsCurrency(minPrice) : ''}
          onChange={handleMinPriceChange}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label className='font-medium text-base'>
          Maximum price
        </Label>
        <Input
          type="text"
        placeholder="~"
          value={maxPrice ? formatAsCurrency(maxPrice) : ''}
          onChange={handleMaxPriceChange}
        />
      </div>
    </div>
  )
}