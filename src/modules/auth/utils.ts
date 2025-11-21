import 'server-only'
import { cookies as getCookies } from "next/headers"

interface Props {
  prefix: string
  value: string
}

export const generateAuthCookie = async ({
  prefix,
  value
}: Props) => {
  // Lưu token vào cookie để maintain session
  const cookies = await getCookies()
  cookies.set({
      // Mặc định tên là 'payload-token' theo payload.config.ts, muốn custom thì sửa trong payload.config.ts với trường cookiePrefix: '...'
      name: `${prefix}-token`, // Tên cookie mặc định hoặc định nghĩa trong constants hoặc cấu hình trong db
      value: value, // JWT token từ PayloadCMS
      httpOnly: true, // Cookie chỉ truy cập được từ server, không từ JavaScript → bảo mật
      path: '/' // Cookie có hiệu lực cho toàn bộ website
      
      // TODO: Cấu hình cho production environment
      // sameSite: "none", // Cho phép cross-site requests
      // domain: "", // Domain cụ thể nếu có subdomain
      // secure: true, // Chỉ gửi cookie qua HTTPS
      // maxAge: 60 * 60 * 24 * 7 // Thời gian sống 7 ngày
  })
}