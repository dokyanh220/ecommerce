import type { Where } from "payload"
import { z } from "zod"
import { Category } from "~/payload-types"
import { baseProcedure, createTRPCRouter } from "~/trpc/init"

// Định nghĩa categories router với các procedure liên quan đến categories
export const procductsRouter = createTRPCRouter({
  // getMany sử dụng baseProcedure query đến các category
  getMany: baseProcedure
    .input(
      z.object({
        category: z.string().nullable().optional() // .nullable() cho phép nhận giá trị null 
      })
    )
    .query(async ({ ctx, input }) => {
      const where : Where = {}
      // ctx được cung cấp bởi baseProcedure
      if (input.category) {
        const categoriesData = await ctx.db.find({
          collection: 'categories',
          limit: 1,
          depth: 1,
          pagination: false,
          where: {
            slug: {
              equals: input.category
            }
          }
        })

        const formattedData = categoriesData.docs.map((doc) => ({
          ...doc, // Giữ nguyên tất cả thuộc tính của category
          subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
            // Vì depth: 1 nên subcategories đã được populate đầy đủ
            ...(doc as Category), // Type assertion để đảm bảo TypeScript hiểu đúng kiểu
            subcategories: undefined // Xóa nested subcategories để tránh render quá sâu
          }))
        }))

        const subcategoriesSlug: string[] = []
        const parentCategory = formattedData[0]

        if (parentCategory) {
            subcategoriesSlug.push(
              ...parentCategory.subcategories.map(sub => sub.slug)
            )
        }

        where['category.slug'] = {
          in: [parentCategory.slug, ...subcategoriesSlug]
        }
      }
      
      // Lấy products từ PayloadCMS
      const data = await ctx.db.find({
        collection: 'products', // Tên collection trong PayloadCMS
        depth: 1, // Populate 'categories' và 'image'
        where
    })
    return data
  })
})