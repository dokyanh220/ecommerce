import { BrevoProvider } from "./config/BrevoProvider"

export async function sendVerificationEmail(to: string, otp: string) {
  const subject = 'OTP verification'
  const htmlContent = `
    <div style="font-family:system-ui">
      <h2 style="color:#F370FF;">Bizmart OTP</h2>
      <p>Your code (OTP) is:</p>
      <p style="font-size:26px;letter-spacing:6px;font-weight:700">${otp}</p>
      <p>OTP expires after 10 minutes.</p>
      <p>If you did not register, please ignore this email.</p>
    </div>
  `
  await BrevoProvider.sendEmail(to, subject, htmlContent)
}