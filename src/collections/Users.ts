import type { CollectionConfig } from 'payload'
import { tenantsArrayField } from "@payloadcms/plugin-multi-tenant/fields"

const defaluTenantArrayField =  tenantsArrayField({
  tenantsArrayFieldName: 'tenants',
  tenantsCollectionSlug: 'tenants',
  tenantsArrayTenantFieldName: 'tenant',
  arrayFieldAccess: {
    read: () => true,
    create: () => true,
    update: () => true
  },
  tenantFieldAccess: {
    read: () => true,
    create: () => true,
    update: () => true
  }
})

const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  access: {
    read: () => true,
  },
  // fields để khai báo các type data của collection
  fields: [
    {
      name: 'username', // Tên trường
      required: true, // Bắt buộc nhập
      unique: true, // Giá trị phải duy nhất
      type: 'text', // Kiểu dữ liệu
    },
    {
      admin: {
        position: "sidebar"
      },
      name: 'roles', // Tên trường
      type: 'select', // Kiểu dữ liệu
      defaultValue: ["user"],
      hasMany: true,
      options: ["super-admin", "user"]
    },
    {
      name: 'phone', // Tên trường
      required: true, // Bắt buộc nhập
      unique: true, // Giá trị phải duy nhất
      type: 'text', // Kiểu dữ liệu
    },
    {
      name: 'active',
      type: 'checkbox',
      required: true,
      defaultValue: false, // Chưa xác thực email
    },
    {
      ...defaluTenantArrayField,
      admin: {
        ...(defaluTenantArrayField?.admin || {}),
        position: "sidebar"
      }
    }
  ]
}

export default Users