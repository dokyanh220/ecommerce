import { Category } from "~/payload-types"
import { baseProcedure, createTRPCRouter } from "~/trpc/init"

// Định nghĩa categories router với các procedure liên quan đến categories
export const categoriesRouter = createTRPCRouter({
  // getMany sử dụng baseProcedure query đến các category
  getMany: baseProcedure.query(async ({ ctx }) => {
    // Lấy danh sách categories từ PayloadCMS
    // ctx được cung cấp bởi baseProcedure
    const data = await ctx.db.find({
      collection: 'categories', // Tên collection trong PayloadCMS
      depth: 1, // Populate relationship 1 cấp - subcategories sẽ được điền đầy đủ thông tin
      pagination: false, // Lấy tất cả records, không phân trang
      where: {
        parent: {
          exists: false // Chỉ lấy categories gốc (không có parent)
        }
      },
      sort: 'name' // Sắp xếp theo tên alphabet
    })
  
    // Chuyển đổi dữ liệu từ PayloadCMS sang format phù hợp cho frontend
    const formattedData = data.docs.map((doc) => ({
      ...doc, // Giữ nguyên tất cả thuộc tính của category
      subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
        // Vì depth: 1 nên subcategories đã được populate đầy đủ
        ...(doc as Category), // Type assertion để đảm bảo TypeScript hiểu đúng kiểu
        subcategories: undefined // Xóa nested subcategories để tránh render quá sâu
      }))
    }))
    // console.log('🚀 ~ formattedData:', formattedData)
    return formattedData
  })
})