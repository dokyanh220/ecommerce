import { inferRouterOutputs } from "@trpc/server"
import type { AppRouter } from "~/trpc/routers/_app"

/**
 * CategoriesGetManyOutput là kiểu dữ liệu đầu ra (output type)
 * của procedure `categories.getMany` trong tRPC.
 * Thay vì tự viết lại interface thủ công (dễ lệch khi backend đổi), ta dùng `inferRouterOutputs`:
 *  - `inferRouterOutputs<AppRouter>`: lấy tất cả kiểu trả về của toàn bộ router gốc (AppRouter)
 *  - `['categories']`: truy cập vào router con `categories`
 *  - `['getMany']`: truy cập vào procedure cụ thể `getMany`
 * Kết quả: nếu backend chỉnh sửa field trả về (ví dụ thêm `hasNextPage`), frontend tự động cập nhật type mà không cần sửa tay.
 * Giúp: type-safe end-to-end, tránh duplicate định nghĩa kiểu dữ liệu.
 * CategoriesGetManyOutput chỉ hỗ trợ gợi ý type, không có dữ liệu thực tế.
 */
export type CategoriesGetManyOutput = inferRouterOutputs<AppRouter>['categories']['getMany']