"use client"

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { registerSchema } from '../../schemas'
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger } from '~/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem
} from '~/components/ui/command'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['700']
})

const countryCodes = [
  { code: "+84", name: "Vietnam" },
  { code: "+1", name: "US" },
  { code: "+44", name: "GB" },
  { code: "+81", name: "Japan" },
  { code: "+82", name: "South Korea" },
  { code: "+86", name: "China" },
]

export const SignUpView = () => {
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

  // Mutation đăng ký 
  const registerMutation = useMutation(
    trpc.auth.register.mutationOptions({
      onSuccess: () => {
        toast.success('Create account successfully!')
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

  const [selectedCode, setSelectedCode] = useState("+84")
  const [openPopover, setOpenPopover] = useState(false)
  const [showPassword, setShowPassword] = useState(false)


  // useForm() nhận vào kiểu dữ liệu của các trường form, validation theo registerSchema
  // < > là generic trong TypeScript để truyền type dữ liệu hoặc function for class
  // z.infer<typeof registerSchema>: Tự động lấy kiểu dữ liệu từ schema Zod đã định nghĩa
  // .infer là hàm của Zod dùng để lấy ra kiểu dữ liệu từ một schema Zod đã tạo ở registerSchema
  const form = useForm<z.infer<typeof registerSchema>>({
    // resolver để react-hook-form biết hãy dùng schema của Zod để kiểm tra dữ liệu nhập
    resolver: zodResolver(registerSchema),
    // Giá trị mặc định cho các trường trong form
    defaultValues: {
      email: '',
      phone: '',
      password: '',
      username: '',
      countryCode: '+84' // Mặc định Việt Nam
    }
  })

  // Cập nhật country code khi user chọn
  const handleCountrySelect = (code: string) => {
    setSelectedCode(code)
    form.setValue('countryCode', code) // Cập nhật vào form
    setOpenPopover(false)
  }

  const onSubmit = (values: z.infer<typeof registerSchema>) => {
    // data mẫu:
    // {
    //   email: "user@example.com",
    //   username: "myusername", 
    //   phone: "901234567",
    //   phoneE164: "+84901234567", // For database
    //   countryCode: "+84", // For database
    //   countryISO: "VN", // For database
    //   password: "mypassword"
    // }
    // Chặn submit trong lúc đang pending (tránh double click)
    if (registerMutation.isPending) return
    registerMutation.mutate(values)
  }

  const username = form.watch('username')
  const usernameErrors = form.formState.errors.username
  
  const shopPreview = username && !usernameErrors

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
                <Link prefetch href='/sign-in'>
                  Sign in
                </Link>
              </Button>
            </div>
            
            <h1 className='text-4xl font-medium'>
              Join over 1,533 creators earning money on BizMart.
            </h1>
            <FormField
              name='username'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-base'>Username</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription
                    className={cn('hidden', shopPreview && 'block')}
                  >
                    Your store will be available at&nbsp;
                    <strong>{username}</strong>.shop.com
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

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
              name='phone'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-base'>Phone</FormLabel>
                  <FormControl>
                     <div className="relative flex">
                      <Popover open={openPopover} onOpenChange={setOpenPopover}>
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            className="rounded-r-none border-r-0 w-[80px]"
                          >
                            {selectedCode}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 w-[200px]">
                          <Command>
                            <CommandInput placeholder="Nation..." />
                            <CommandEmpty>Not found</CommandEmpty>
                            <CommandGroup>
                              {countryCodes.map((c) => (
                                <CommandItem
                                  key={c.code}
                                  onSelect={() => {handleCountrySelect(c.code)}}
                                >
                                  <span>{c.name}</span>
                                  <span className="ml-auto text-muted-foreground">{c.code}</span>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>

                      <Input
                        {...field}
                        type="tel"
                        className="rounded-l-none"
                        onChange={e => {
                          const digitsOnly = e.target.value.replace(/\D/g, "");
                          field.onChange(digitsOnly);
                        }}
                      />
                    </div>
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
              disabled={registerMutation.isPending}
              type='submit'
              size='lg'
              variant='elevated'
              className='bg-black text-white hover:bg-pink-400 disabled:opacity-60 disabled:pointer-events-none'
            >
              {registerMutation.isPending ? 'Creating…' : 'Create account'}
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