import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

export async function sendVerificationEmail(to: string, otp: string) {
  await transporter.sendMail({
    from: process.env.MAIL_FROM || '"Bizmart" <no-reply@bizmart.local>',
    to,
    subject: 'Xác thực tài khoản',
    html: `
      <div style="font-family:system-ui">
        <h2>Verify your account</h2>
        <p>Mã xác thực (OTP) của bạn là:</p>
        <p style="font-size:26px;letter-spacing:6px;font-weight:700">${otp}</p>
        <p>Mã hết hạn sau 10 phút.</p>
        <p>Nếu không phải bạn thực hiện đăng ký, hãy bỏ qua email này.</p>
      </div>
    `
  })
}