import { TRPCError } from "@trpc/server"
import { headers as getHeaders, cookies as getCookies } from "next/headers"
import z from "zod"
import { baseProcedure, createTRPCRouter } from "~/trpc/init"
import { AUTH_COOKIE } from "../constansts"
import { loginSchema, registerSchema } from "../schemas"

// Tạo auth router để xử lý tất cả các thao tác liên quan đến authentication
export const authRouter = createTRPCRouter({

  // LẤY THÔNG TIN PHIÊN ĐĂNG NHẬP 
  session: baseProcedure.query(async ({ ctx }) => {
    // headers chứa tất cả thông tin headers từ HTTP request (cookie, user-agent, authorization...)
    // getHeaders() là hàm async của Next.js để lấy headers từ request hiện tại
    const headers = await getHeaders()

    // Gọi method auth() của PayloadCMS để xác thực user dựa trên headers
    // PayloadCMS sẽ tự động đọc cookie/token từ headers và trả về thông tin user
    // Nếu không có token hoặc token hết hạn → trả về null
    // Nếu token hợp lệ → trả về thông tin user (id, email, role...)
    const session = await ctx.db.auth({ headers })
    
    // Trả về thông tin user session để client biết user có đăng nhập hay chưa
    return session
  }),

  logout: baseProcedure.mutation(async () => {
    // Lấy cookie store từ Next.js để thao tác với cookies
    const cookie = await getCookies();
    
    // Xóa AUTH_COOKIE để user bị đăng xuất
    // Sau khi xóa cookie, các request tiếp theo sẽ không có token → user chưa đăng nhập
    cookie.delete(AUTH_COOKIE)
  }),

  register: baseProcedure
    .input(registerSchema)
    .mutation(async ({ input, ctx }) => {
      // existingData: Kiểm tra xem username đã tồn tại trong DB chưa
      const existingData = await ctx.db.find({
        collection: 'users',
        limit: 1,
        where: {
          username: {
            equals: input.username
          }
        }
      })

      // Lấy user đầu tiên từ kết quả tìm kiếm
      const existingUser = existingData.docs[0]

      // Nếu đã tồn tại user với username này thì báo lỗi
      if (existingUser) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Username already taken'
        })
      }

      // Tạo user mới trong collection 'users' của PayloadCMS
      // PayloadCMS sẽ tự động hash(băm) password và validate dữ liệu
      await ctx.db.create({
        collection: 'users', // Tên collection trong PayloadCMS
        data: {
          email: input.email,
          password: input.password, // PayloadCMS tự động hash password
          username: input.username,
          phone: input.phone
        }
      })
      
      // Không trả về gì - chỉ tạo user thành công
      // Client có thể redirect hoặc hiển thị thông báo thành công
    }),

  login: baseProcedure
    .input(loginSchema)
    .mutation(async ({ input, ctx }) => {
      // Gọi method login của PayloadCMS để xác thực user
      // PayloadCMS sẽ so sánh email/password với dữ liệu trong DB
      const data = await ctx.db.login({
        collection: 'users', // Collection chứa user data
        data: {
          email: input.email,
          password: input.password
        }
      })

      // Kiểm tra login có thành công không
      // Nếu thông tin sai, PayloadCMS không trả về token
      if (!data.token) {
        throw new TRPCError({
          code: 'UNAUTHORIZED', // HTTP 401 status
          message: 'Failed to login' // Thông báo lỗi cho client
        })
      }

      // Lưu token vào cookie để maintain session
      const cookies = await getCookies()
      cookies.set({
        name: AUTH_COOKIE, // Tên cookie đã định nghĩa trong constants
        value: data.token, // JWT token từ PayloadCMS
        httpOnly: true, // Cookie chỉ truy cập được từ server, không từ JavaScript → bảo mật
        path: '/' // Cookie có hiệu lực cho toàn bộ website
        
        // TODO: Cấu hình cho production environment
        // sameSite: "none", // Cho phép cross-site requests
        // domain: "", // Domain cụ thể nếu có subdomain
        // secure: true, // Chỉ gửi cookie qua HTTPS
        // maxAge: 60 * 60 * 24 * 7 // Thời gian sống 7 ngày
      })

      // Trả về thông tin user và token cho client
      // Client có thể lưu user info vào state/context
      return data
    }),
})