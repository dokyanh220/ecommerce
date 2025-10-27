import type { CollectionConfig } from 'payload'

const EmailVerifications: CollectionConfig = {
  slug: 'email-verifications',
  admin: {
    hidden: true, // Không cần hiển thị trong admin (có thể bỏ nếu muốn debug)
  },
  fields: [
    {
      name: 'user', // Reference tới user
      type: 'relationship',
      relationTo: 'users',
      required: true,
      unique: true, // Mỗi user chỉ có 1 record đang hiệu lực
    },
    {
      name: 'codeHash',
      type: 'text',
      required: true,
    },
    {
      name: 'expiresAt',
      type: 'date',
      required: true,
    },
    {
      name: 'attempts',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'resendCount',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'lastSentAt',
      type: 'date',
      required: true,
    },
    {
      name: 'valid',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}

export default EmailVerifications