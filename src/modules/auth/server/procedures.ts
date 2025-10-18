import { headers as getHeaders } from "next/headers";
import { baseProcedure, createTRPCRouter } from "~/trpc/init";

// Định nghĩa auth router với các procedure liên quan đến xác thực
export const authRouter = createTRPCRouter({
  // session procedure để lấy thông tin lần đăng nhập
  session: baseProcedure.query(async ({ ctx }) => {
    // headers là một đối tượng chứa thông tin headers của request
    // getHeaders() là hàm bất đồng bộ trả về headers của request hiện tại
    const headers = await getHeaders()

    // Sử dụng phương thức auth của db(Payload) để lấy thông tin lần đăng nhập
    const session = await ctx.db.auth({ headers })

    return session
  })
})