"use client"

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { loginSchema } from '../../schemas'
import { Poppins } from 'next/font/google'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useTRPC } from '~/trpc/client'
import Link from 'next/link' 
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '~/components/ui/form'
import { cn } from '~/lib/utils'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { useState } from 'react'
import { Eye, EyeClosed } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['700']
})

export const SignInView = () => {
  const router = useRouter()
  const trpc = useTRPC()
  // Helper chuẩn hóa thông điệp lỗi (tRPC/Zod có thể trả mảng JSON)
  const extractErrorMessage = (raw: string) => {
    try {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed[0]?.message) return parsed[0].message as string
    } catch {/* không phải JSON */}
    return raw
  }

  // Mutation đăng nhập 
  const loginMutation = useMutation(
    trpc.auth.login.mutationOptions({
      onSuccess: () => {
        toast.success('Login successfully!')
        // form.reset()
        router.push('/')
      },
      onError: (error) => {
        let msg = extractErrorMessage(error.message)
        if (msg.toLowerCase().includes('username already taken')) {
          msg = 'Username is existed'
        }
        toast.error(msg)
      }
    })
  )

  const [showPassword, setShowPassword] = useState(false)


  // useForm() nhận vào kiểu dữ liệu của các trường form, validation theo loginSchema
  // < > là generic trong TypeScript để truyền type dữ liệu hoặc function for class
  // z.infer<typeof loginSchema>: Tự động lấy kiểu dữ liệu từ schema Zod đã định nghĩa
  // .infer là hàm của Zod dùng để lấy ra kiểu dữ liệu từ một schema Zod đã tạo ở loginSchema
  const form = useForm<z.infer<typeof loginSchema>>({
    // resolver để react-hook-form biết hãy dùng schema của Zod để kiểm tra dữ liệu nhập
    resolver: zodResolver(loginSchema),
    // Giá trị mặc định cho các trường trong form
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    // data mẫu:
    // {
    //   email: "user@example.com",
    //   password: "mypassword"
    // }
    // Chặn submit trong lúc đang pending (tránh double click)
    if (loginMutation.isPending) return
    loginMutation.mutate(values)
  }

  return ( 
    <div className="grid grid-cols-1 lg:grid-cols-5">
      <div className="bg-[#f4f4f0] h-screen w-full lg:col-span-3 overflow-y-auto">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex flex-col gap-8 p-4 lg:p-16'
          >
            <div className='flex items-center justify-between mb-8'>
              <Link href='/'>
                <span className={cn('text-2xl font-semibold', poppins.className)}>
                  BizMart
                </span>

              </Link>
              <Button
                asChild
                variant='ghost'
                size='sm'
                className='text-base border-none underline'
              >
                <Link prefetch href='/sign-up'>
                  Sign up
                </Link>
              </Button>
            </div>
            
            <h1 className='text-4xl font-medium'>
              Welcome back to BizMart.
            </h1>
            <FormField
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-base'>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-base'>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        {...field} 
                        type={showPassword ? 'text' : 'password'}
                        className="pr-10"
                      />

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <Eye className="h-4 w-4 text-gray-500" />
                        ) : (
                          <EyeClosed className="h-4 w-4 text-gray-500" />
                        )}
                        <span className="sr-only">
                          {showPassword ? 'Hide password' : 'Show password'}
                        </span>
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              disabled={loginMutation.isPending}
              type='submit'
              size='lg'
              variant='elevated'
              className='bg-black text-white hover:bg-pink-400 disabled:opacity-60 disabled:pointer-events-none'
            >
              {loginMutation.isPending ? 'Creating…' : 'Create account'}
            </Button>
          </form>
        </Form>
      </div>

      <div
        className="h-screen w-full lg:col-span-2 hidden lg:block"
        style={{
          backgroundImage: "url('./auth-bg.jpeg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
    </div>
  );
}