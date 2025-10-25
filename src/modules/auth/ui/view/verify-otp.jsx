"use client"

import { useState, useRef, useEffect } from 'react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { cn } from '~/lib/utils'
import { toast } from 'sonner'

const VerifyOtp = ({ onSubmit, loading = false, resendOtp, email }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const inputRefs = useRef([])

  // Focus vào input đầu tiên khi component mount
  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  const handleChange = (index, value) => {
    // Chỉ cho phép nhập số
    if (value && !/^\d$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value

    setOtp(newOtp)

    // Tự động focus sang ô tiếp theo
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    // Xử lý Backspace
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // Nếu ô hiện tại trống, focus về ô trước
        inputRefs.current[index - 1]?.focus()
      } else {
        // Xóa ô hiện tại
        const newOtp = [...otp]
        newOtp[index] = ''
        setOtp(newOtp)
      }
    }
    
    // Xử lý Arrow keys
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    
    if (pastedData.length === 6) {
      const newOtp = pastedData.split('')
      setOtp(newOtp)
      // Focus vào ô cuối cùng
      inputRefs.current[5]?.focus()
      toast.success('OTP đã được dán thành công')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const otpValue = otp.join('')
    
    if (otpValue.length !== 6) {
      toast.error('Vui lòng nhập đầy đủ 6 chữ số OTP')
      return
    }

    onSubmit?.(otpValue)
  }

  const handleResend = () => {
    setOtp(['', '', '', '', '', ''])
    inputRefs.current[0]?.focus()
    resendOtp?.()
  }

  const isComplete = otp.every(digit => digit !== '')

  return (
    <div className="w-full h-screen max-w-md mx-auto flex flex-col justify-center items-center">
      <form onSubmit={handleSubmit} className="space-y-6 border-2 w-2xl h-[400px] p-6 rounded-lg shadow-xl/20">
        {/* Header */}
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold">Verify OTP</h2>
          <p className="text-sm text-muted-foreground">
            Enter the 6-digit code sent to {email || 'your email address'}
          </p>
        </div>

        {/* OTP Input Fields */}
        <div className="flex justify-center gap-3">
          {otp.map((digit, index) => (
            <Input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              className={cn(
                "w-12 h-12 text-center text-lg font-semibold",
                "border-2 rounded-lg",
                digit ? "border-primary bg-primary/5" : "border-muted-foreground/30",
                "focus:border-primary focus:ring-2 focus:ring-primary/20",
                "transition-colors duration-200"
              )}
              disabled={loading}
            />
          ))}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant='elevated'
          disabled={!isComplete || loading}
          className="w-full h-12 text-base bg-black text-white font-semibold hover:bg-pink-400"
          size="lg"
        >
          {loading ? 'Verifying...' : 'Verify OTP'}
        </Button>

        {/* Resend OTP */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Not received the code?
          </p>
          <Button
            type="button"
            variant="link"
            onClick={handleResend}
            disabled={loading}
            className="text-primary hover:underline"
          >
            Send again
          </Button>
        </div>
      </form>
    </div>
  )
}

export default VerifyOtp