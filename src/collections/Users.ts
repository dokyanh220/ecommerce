import type { CollectionConfig } from 'payload'

const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    {
      name: 'username', // Tên trường
      required: true, // Bắt buộc nhập
      unique: true, // Giá trị phải duy nhất
      type: 'text', // Kiểu dữ liệu
    }
  ]
}

export default Users