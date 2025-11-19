import { createTRPCRouter } from '../init'
import { categoriesRouter } from '~/modules/categories/server/procedures'
import { authRouter } from '~/modules/auth/server/procedures'
import { procductsRouter } from '~/modules/products/server/procedures'

export const appRouter = createTRPCRouter({
  auth: authRouter,
  categories: categoriesRouter,
  products: procductsRouter
})
// export type definition of API
export type AppRouter = typeof appRouter