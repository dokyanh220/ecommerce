import 'dotenv/config'

export const env = {
  MONGODB_URI: process.env.MONGODB_URI,
  PAYLOAD_SECRET: process.env.PAYLOAD_SECRET,

  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,

  BREVO_API_KEY: process.env.BREVO_API_KEY,
  ADMIN_EMAIL_ADDRESS: process.env.ADMIN_EMAIL_ADDRESS,
  ADMIN_EMAIL_NAME: process.env.ADMIN_EMAIL_NAME,
}