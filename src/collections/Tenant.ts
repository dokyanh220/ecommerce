import type { CollectionConfig } from 'payload'

const Tenants: CollectionConfig = {
  slug: 'tenants',
  admin: {
    useAsTitle: 'slug',
  },
  auth: true,
  access: {
    read: () => true,
  },
  // fields để khai báo các type data của collection
  fields: [
    {
      name: 'name', // Tên trường
      required: true, // Bắt buộc nhập
      type: 'text', // Kiểu dữ liệu
      label: "Store name",
      admin: {
        description: "This is the name of store (Dokyanh's store)"
      }
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: "This is the subdomain for the store (dokyanh.bizmart.com)"
      }
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'stripeAccountId',
      type: 'text',
      required: true,
      admin: {
        readOnly: true
      }
    },
    {
      name: 'stripeDetailsSubmitted',
      type: 'checkbox',
      required: true,
      admin: {
        readOnly: true,
        description: 'You cannot create products until you submit your Stripe details'
      }
    },
  ]
}

export default Tenants