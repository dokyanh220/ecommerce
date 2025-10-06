import { Category } from "~/payload-types";

export type CustomCategory = Category & {
  // Omit là một utility type(kiểu tiện ích) được tích hợp sẵn trong TypeScript. Nó cho phép bạn tạo một kiểu mới bằng cách loại bỏ một hoặc nhiều thuộc tính từ kiểu gốc.
  // Ở đây, Omit<Category, 'subcategories'> tạo ra một kiểu mới dựa trên kiểu Category, nhưng loại bỏ thuộc tính subcategories khỏi kiểu đó.
  // subcategories?: Omit<Category, 'subcategories'>[]

  // Việc sử dụng Omit<Category, 'subcategories'>[] thay vì Category[] giúp tránh việc lặp lại đệ quy không cần thiết và làm cho kiểu dữ liệu trở nên đơn giản hơn.
  subcategories?: CustomCategory[]
}