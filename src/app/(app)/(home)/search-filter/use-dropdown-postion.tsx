import { RefObject } from "react"

export const useDropdownPostion = (
  ref: RefObject<HTMLDivElement | null> | RefObject<>
) => {
  const getDropdownPosition = () => {
    // Nếu ref.current không tồn tại, mặc định = { top: 0, left: 0 }
    if (!ref.current) return { top: 0, left: 0 }

    // getBoundingClientRect là hàm của DOM trả về vị trí, tọa độ và kích thước của phần tử
    const rect = ref.current.getBoundingClientRect()
    const dropdownWidth = 240 // Chiều rộng của dropdown (w-60 = 15rem * 16px = 240px)

    // Tính tọa độ top và left
    let left = rect.left + window.scrollX
    let top = rect.bottom + window.scrollY
    
    // Kiểm tra nếu dropdown vượt qua cạnh phải trình duyệt
    if (left + dropdownWidth > window.innerWidth) {
      // Nếu vượt qua cạnh phải, căn chỉnh dropdown về bên trái
      left = rect.right + window.scrollX - dropdownWidth

      // Nếu vượt qua cạnh trái, căn chỉnh dropdown về bên phải
      if (left < 0) {
        left = window.innerWidth - dropdownWidth - 16
      }
    }

    if (left < 0) {
      left = 16 // Căn chỉnh nếu vượt qua cạnh trái
    }

    return { top, left }
  }

  return { getDropdownPosition }
}