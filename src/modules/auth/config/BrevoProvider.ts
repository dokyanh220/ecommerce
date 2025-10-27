// Lưu ý Brevo là tên thương hiệu mới của sib - Sendinblue
// Vì thế trong phần hướng dẫn trên github có thể nó vẫn còn giữ tên biến SibApiV3Sdk
// https://github.com/getbrevo/brevo-node
import * as SibApiV3Sdk from '@getbrevo/brevo'
import { env } from '~/config/environment'

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi()
apiInstance.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, env.BREVO_API_KEY || '')

const sendEmail = async (
  recipientEmail: string, 
  customSubject: string, 
  htmlContent: string
) => {
  try {
    // Khởi tạo sendSmtpEmail
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail()

    // Tài khoản gửi mail: địa chỉ admin email, là email tạo tài khoản Brevo
    sendSmtpEmail.sender = { email: env.ADMIN_EMAIL_ADDRESS, name: env.ADMIN_EMAIL_NAME }

    // Những tài khoản nhận mail
    // 'to' là Array để tùy biến gửi mail tới users theo tùy tính năng
    sendSmtpEmail.to = [{ email: recipientEmail }]

    // Tiêu đề:
    sendSmtpEmail.subject = customSubject

    // Nội dung: định dạng html
    sendSmtpEmail.htmlContent = htmlContent

    // Gọi hành động gửi mail
    return apiInstance.sendTransacEmail(sendSmtpEmail)
  } catch (error) {
    console.error('Brevo send email error:', error)
    throw new Error(`Failed to send email via Brevo: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export const BrevoProvider = {
  sendEmail
}