import z from "zod"
import { parsePhoneNumberFromString } from "libphonenumber-js"

// Map country codes với country ISO codes và số digit tối thiểu
const countryMap: Record<string, { iso: string, minDigits: number, maxDigits: number }> = {
  "+84": { iso: "VN", minDigits: 9, maxDigits: 10 }, // Vietnam: 901234567 (9 digits)
  "+1": { iso: "US", minDigits: 10, maxDigits: 10 },  // US: 2025551234 (10 digits)
  "+44": { iso: "GB", minDigits: 10, maxDigits: 11 }, // UK: 7911123456 (10-11 digits)
  "+81": { iso: "JP", minDigits: 10, maxDigits: 11 }, // Japan
  "+82": { iso: "KR", minDigits: 9, maxDigits: 10 },  // South Korea
  "+86": { iso: "CN", minDigits: 11, maxDigits: 11 }, // China
}

export const registerSchema = z
  .object({
    email: z.string().email(), // Email phải đúng format email standard
    password: z.string().min(6, 'Password must be at least 6 characters'), // Password tối thiểu 6 ký tự để đảm bảo bảo mật
    username: z.string() // Username phải tuân thủ các quy tắc:
      .min(3, 'Username must be at least 3 characters') // Tối thiểu 3 ký tự
      .max(64, 'Username must be at most 64 characters') // Tối đa 64 ký tự
      // Regex: chỉ cho phép chữ thường, số, dấu gạch ngang. Bắt đầu và kết thúc bằng chữ/số
      .regex(/^[a-z0-9][a-z0-9-]*[a-z0-9]$/, 'Username can only contain lowercase letters, numbers, and hyphens. It must start and end with a letter or number')
      // Không cho phép 2 dấu gạch ngang liên tiếp
      .refine((val) => !val.includes('--'), 'Username cannot contain consecutive hyphens')
      // Tự động chuyển thành chữ thường
      .transform((val) => val.toLowerCase()),
    phone: z.string()
      .min(1, "Phone number is required") // Bắt buộc nhập
      .regex(/^\d+$/, "Phone number must contain only digits")
      .transform((val) => {
        // Loại bỏ tất cả ký tự không phải số
        let phone = val.replace(/\D/g, "");
        // Nếu bắt đầu bằng '84' thì bỏ 2 số đầu
        if (phone.startsWith("84")) phone = phone.slice(2);
        // Nếu bắt đầu bằng '0' thì bỏ số đầu
        if (phone.startsWith("0")) phone = phone.slice(1);
        return phone;
      }),
    // Thêm field cho country code (ẩn, sẽ được set từ UI)
    countryCode: z.string().default("+84")
  })
  .superRefine((data, ctx) => { // Transform và validate phone number theo từng country
    // Lấy thông tin country
    const countryInfo = countryMap[data.countryCode]
    
    if (!countryInfo) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['countryCode'],
        message: `Unsupported country code: ${data.countryCode}`
      })
      return
    }
    
    // Kiểm tra độ dài phone theo country
    const cleanPhone = data.phone.replace(/\s+/g, "")
    const { minDigits, maxDigits } = countryInfo
    
    if (cleanPhone.length < minDigits || cleanPhone.length > maxDigits) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['phone'],
        message: `Phone number for ${data.countryCode} must be ${minDigits}-${maxDigits} digits. You entered ${cleanPhone.length} digits.`
      })
      return
    }
    
    // Validate với libphonenumber-js
    const fullPhoneNumber = `${data.countryCode}${cleanPhone}`
    const parsedPhone = parsePhoneNumberFromString(fullPhoneNumber, countryInfo.iso as any)
    
    if (!parsedPhone || !parsedPhone.isValid()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['phone'],
        message: `Invalid phone number format for ${data.countryCode}. Example: ${getExampleNumber(data.countryCode)}`
      })
      return
    }
  })
  .transform((data) => {
    const countryInfo = countryMap[data.countryCode]!
    const cleanPhone = data.phone.replace(/\s+/g, "")
    const fullPhoneNumber = `${data.countryCode}${cleanPhone}`
    const parsedPhone = parsePhoneNumberFromString(fullPhoneNumber, countryInfo.iso as any)!
    
    return {
      ...data,
      phone: data.phone, // 901234567
      // phoneE164: parsedPhone.number, // +84901234567 (cho đẹp hoặc sau này gửi otp)
      countryISO: countryInfo.iso // VN, US, GB...
    }
  })

// Helper function show ví dụ
function getExampleNumber(countryCode: string): string {
  const examples: Record<string, string> = {
    "+84": "901234567", // Vietnam
    "+1": "2025551234", // US  
    "+44": "7911123456", // UK
    "+81": "9012345678", // Japan
    "+82": "1012345678", // South Korea
    "+86": "13912345678", // China
  }
  return examples[countryCode] || "123456789"
}

export const loginSchema = z.object({
  email: z.string().email(), // Email phải đúng format
  password: z.string() // Password không cần validate vì đã có trong DB
})

export const verifySchema = z.object({
  email: z.string().email(),
  code: z.string().length(6, "OTP must be 6 digits")
})