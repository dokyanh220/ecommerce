import type { CollectionConfig } from 'payload'

const Products: CollectionConfig = {
  slug: 'products',
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true
    },
    {
      name: 'description',
      type: 'text'
    },
    {
      name: 'price',
      type: 'number',
      admin: {
        description: 'Price in USD'
      },
      required: true
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: false
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media'
    },
    {
      name: 'refundPolicy',
      type: 'select',
      options: ['30-days', '14-days', '7-days', '3-days', '1-days', 'no-refunds'],
      defaultValue: '30-days'
    }
  ]
}

export default Products