import { TRPCError } from "@trpc/server"
import { headers as getHeaders, cookies as getCookies } from "next/headers"
import { baseProcedure, createTRPCRouter } from "~/trpc/init"
import { loginSchema, registerSchema, verifySchema } from "../schemas"
import { generateAuthCookie } from "../utils"
import { generateOtp, hashOtp } from "../otp"
import { sendVerificationEmail } from "../email"

// Biến cấu hình OTP cục bộ, dùng cho register, verifyEmail, resendEmailOtp
const OTP_EXP_MINUTES = 10
const MAX_ATTEMPTS = 5
const RESEND_INTERVAL_SECONDS = 60
const MAX_RESEND_PER_HOUR = 5
let currentResendCount = 0

// Helper function: Tạo và gửi email OTP
async function generateSendEmail(ctx: any, userId: string, email: string, resendCount = 0) {
  // Tạo OTP mới
  const otp = generateOtp(6)
  const codeHash = hashOtp(otp)

  // Tạo record email-verification mới
  const newRecord = await ctx.db.create({
    collection: 'email-verifications',
    data: {
      user: userId,
      codeHash,
      expiresAt: new Date(Date.now() + OTP_EXP_MINUTES * 60 * 1000).toISOString(),
      attempts: 0,
      resendCount,
      lastSentAt: new Date().toISOString(),
      valid: true
    }
  })

  // Gửi email OTP
  await sendVerificationEmail(email, otp)

  return {
    recordId: newRecord.id,
    message: 'OTP sent successfully'
  }
}

// Helper function: tách logic login chung
async function performLogin(ctx: any, email: string, password: string) {
  // Gọi method login của PayloadCMS để xác thực user
  // PayloadCMS sẽ so sánh email/password với dữ liệu trong DB
  const data = await ctx.db.login({
    collection: 'users', // Collection chứa user data
    data: { email, password }
  })

  // Kiểm tra login có thành công không
  // Nếu thông tin sai, PayloadCMS không trả về token
  if (!data.token) {
    throw new TRPCError({
      code: 'UNAUTHORIZED', // HTTP 401 status
      message: 'Failed to login' // Thông báo lỗi cho client
    })
  }

  // API: http://localhost:3000/api/users/login
  
  await generateAuthCookie({
    prefix: ctx.db.config.cookiePrefix,
    value: data.token
  })
  // Trả về thông tin user và token cho client
  // Client có thể lưu user info vào state/context
  return data
}

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

  register: baseProcedure
    .input(registerSchema)
    .mutation(async ({ input, ctx }) => {
      const checks: { field: keyof typeof input; message: string }[] = [
        { field: 'username', message: 'Username already taken' },
        { field: 'email', message: 'Email already taken' },
        { field: 'phone', message: 'Phone already taken' },
      ]

      const results = await Promise.all(
        checks.map(({ field }) =>
          ctx.db.find({
            collection: 'users',
            where: { [field]: { equals: input[field] } },
            limit: 1,
          })
        )
      )

      results.forEach((res, i) => {
        if (res.docs?.[0]) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: checks[i].message,
          })
        }
      })

      // Tạo user mới trong collection 'users' của PayloadCMS
      // PayloadCMS sẽ tự động hash(băm) password và validate dữ liệu
      const newUser = await ctx.db.create({
        collection: 'users', // Tên collection trong PayloadCMS
        data: {
          email: input.email,
          password: input.password, // PayloadCMS tự động hash password
          username: input.username,
          phone: input.phone,
          active: false
        }
      })

      // Thực hiện tạo OTP từ server gửi đến email user để verify sau đó auto login
      // Tạo OTP
      await generateSendEmail(ctx.db, newUser.id, input.email)

      // Không login ngay (user chưa active)
      return {
        email: input.email,
        message: 'Account created. Please verify your email.'
      }
    }),

  verifyEmail: baseProcedure
    .input(verifySchema)
    .mutation(async ({ input, ctx }) => {
      const { email, code } = input

      // Tìm user
      const users = await ctx.db.find({
        collection: 'users',
        where: { email: { equals: email } },
        limit: 1
      })
      const user = users.docs?.[0]
      if (!user) throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })
      if (user.active) return { message: 'Already verified', redirect: '/' }

      // Lấy record OTP
      const records = await ctx.db.find({
        collection: 'email-verifications',
        where: {
          user: { equals: user.id },
          valid: { equals: true }
        },
        limit: 1
      })
      const record = records.docs?.[0]
      if (!record) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'No valid OTP - please resend' })
      }

      // Kiểm tra hết hạn
      if (new Date(record.expiresAt).getTime() < Date.now()) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'OTP expired - resend needed' })
      }

      // Kiểm tra lần nhập
      // Ban đầu attempts = 0, có thể pass kiểm tra lần đầu sau đó mới thực hiện tăng số lần
      if ((record.attempts || 0) >= MAX_ATTEMPTS) {
        await ctx.db.delete({
          collection: 'email-verifications',
          id: record.id
        });
        throw new TRPCError({ code: 'TOO_MANY_REQUESTS', message: 'Too many attempts' });
      }

      // So sánh mã
      const ok = hashOtp(code) === record.codeHash
      if (!ok) {
        const newAttempts = (record.attempts || 0) + 1;
        await ctx.db.update({
          collection: 'email-verifications',
          id: record.id,
          data: {
            attempts: newAttempts
          }
        });
        // Nếu sau khi tăng attempts thì đủ 5 lần, xóa record luôn
        if (newAttempts === MAX_ATTEMPTS) {
          currentResendCount = record.resendCount || 0
          await ctx.db.delete({
            collection: 'email-verifications',
            id: record.id
          });
          throw new TRPCError({ code: 'TOO_MANY_REQUESTS', message: 'Too many attempts' });
        }
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Incorrect OTP' });
      }

      // Thành công: cập nhật user + xóa record cho đỡ tốn DB cluster miễn phí
      await ctx.db.update({
        collection: 'users',
        id: user.id,
        data: { active: true }
      })
      await ctx.db.delete({
        collection: 'email-verifications',
        id: record.id
      })

      // Login tự động sau verify
      const loginData = await performLogin(ctx, input.email, input.password)

      return { 
        message: 'Verified successfully', 
        redirect: '/',
        user: loginData.user 
      }
    }),

  resendEmailOtp: baseProcedure
    .input(verifySchema)
    .mutation(async ({input, ctx}) => {
      // Tìm user
      const usersFind = await ctx.db.find({
        collection: 'users',
        where: { email: { equals: input.email } },
        limit: 1
      })
      const user = usersFind.docs?.[0]
      if (!user) throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })
      if (user.active) return { message: 'Verified successfully' }

      // Lấy record
      const records = await ctx.db.find({
        collection: 'email-verifications',
        where: {
          user: { equals: user.id },
          valid: { equals: true }
        },
        limit: 1
      })
      const record = records.docs?.[0]

      if (record) {
        // Cooldown
        const diffSeconds = (Date.now() - new Date(record.lastSentAt).getTime()) / 1000
        if (diffSeconds < RESEND_INTERVAL_SECONDS) {
          throw new TRPCError({
            code: 'TOO_MANY_REQUESTS',
            message: 'Please wait before resending'
          })
        }
        if ((record.resendCount || 0) >= MAX_RESEND_PER_HOUR) {
          throw new TRPCError({
            code: 'TOO_MANY_REQUESTS',
            message: 'Resend limit reached'
          })
        }
        // Xóa record cũ trước khi tạo mới
        await ctx.db.delete({
          collection: 'email-verifications',
          id: record.id
        })
      }

      // Tạo và gửi OTP mới
      await generateSendEmail(ctx.db, user.id, input.email, currentResendCount + 1)

      return { message: 'OTP resent successfully' }
    }),

  login: baseProcedure
    .input(loginSchema)
    .mutation(async ({ input, ctx }) => {
      // Kiểm tra email tồn tại
      const users = await ctx.db.find({
        collection: 'users',
        where: {
          email: { equals: input.email }
        },
        limit: 1
      })

      if (!users?.docs?.length) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: "Email or password doesn't correct"
        })
      }

      return await performLogin(ctx, input.email, input.password)
    }),
  
  logout: baseProcedure.mutation(async () => {
    // Lấy cookie store từ Next.js để thao tác với cookies
    // const cookie = await getCookies();
    
    // Xóa cookie để user bị đăng xuất
    // Sau khi xóa cookie, các request tiếp theo sẽ không có token → user chưa đăng nhập
    // cookie.delete()
  })
})