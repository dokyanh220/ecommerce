import { baseProcedure, createTRPCRouter } from "~/trpc/init";

export const categoriesRouter = createTRPCRouter({
  // getMany sử dụng baseProcedure query đến các category
  getMany: baseProcedure.query(async () => {
    return [{ hello: 'world' }]
  })
})