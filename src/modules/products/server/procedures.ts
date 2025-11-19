import { baseProcedure, createTRPCRouter } from "~/trpc/init"

// Định nghĩa categories router với các procedure liên quan đến categories
export const procductsRouter = createTRPCRouter({
  // getMany sử dụng baseProcedure query đến các category
  getMany: baseProcedure.query(async ({ ctx }) => {
    // Lấy danh sách categories từ PayloadCMS
    // ctx được cung cấp bởi baseProcedure
    const data = await ctx.db.find({
      collection: 'products', // Tên collection trong PayloadCMS
      depth: 1 // Populate 'categories' và 'image'
    })
    return data
  })
})