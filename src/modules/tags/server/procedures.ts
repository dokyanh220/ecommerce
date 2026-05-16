import { z } from "zod"
import { DEFAULT_TAGS_LIMIT } from "~/constants"
import { baseProcedure, createTRPCRouter } from "~/trpc/init"

// Định nghĩa tags router với các procedure liên quan đến tags
export const tagsRouter = createTRPCRouter({
  // getMany sử dụng baseProcedure query đến các tags
  getMany: baseProcedure
    .input(
      z.object({
        cursor: z.number().default(1),
        limit: z.number().default(DEFAULT_TAGS_LIMIT)
      })
    )
    .query(async ({ ctx, input }) => {
      // Lấy tags từ PayloadCMS
      const data = await ctx.db.find({
        collection: 'tags', // Tên collection trong PayloadCMS
        page: input.cursor,
        limit: input.limit
      })
      return data
    })
})