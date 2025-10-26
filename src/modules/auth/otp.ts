import crypto from 'crypto'

export function generateOtp(length = 6) {
  let code = ''
  for (let i = 0; i < length; i++) {
    // Sử dụng crypto.randomInt để tạo ra 6 con số ngẫu nhiên từ 0 đến 9
    // crypto.randomInt là an toàn hơn so với Math.random cho mục đích bảo mật
    code += crypto.randomInt(0, 10).toString()
  }
  return code
}

export function hashOtp(code: string) {
  // Sử dụng hàm băm SHA-256 để bảo vệ mã OTP trước khi lưu vào cơ sở dữ liệu
  // SHA-256 là thuật toán bảo mật mạnh, khó bị phá với công nghệ hiện tại
  return crypto.createHash('sha256').update(code).digest('hex')
}