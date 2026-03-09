import type { CollectionConfig } from 'payload'

const Tags: CollectionConfig = {
    slug: 'tags',
    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'name',
            type: 'text',
            required: true,
        },
        {
            name: 'products',
            type: 'relationship',
            relationTo: 'products',
            hasMany: true,
        },
    ],
}

export default Tags