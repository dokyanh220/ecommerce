import crypto from 'crypto'

export function generateOtp(length = 6) {
  let code = ''
  for (let i = 0; i < length; i++) {
    code += crypto.randomInt(0, 10).toString()
  }
  return code
}

export function hashOtp(code: string) {
  return crypto.createHash('sha256').update(code).digest('hex')
}