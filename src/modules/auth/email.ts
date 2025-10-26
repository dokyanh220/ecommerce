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
    from: '"Bizmart" <no-reply@bizmart.local>',
    to,
    subject: 'OTP verification',
    html: `
      <div style="font-family:system-ui">
        <h2 style="color:#F370FF;">Bizmart OTP</h2>
        <p>Your code (OTP) is:</p>
        <p style="font-size:26px;letter-spacing:6px;font-weight:700">${otp}</p>
        <p>OTP expires after 10 minutes.</p>
        <p>If you did not register, please ignore this email.</p>
      </div>
    `
  })
}