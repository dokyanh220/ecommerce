"use client"

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '../../schemas';
import { cn } from '~/lib/utils';
import { Poppins } from 'next/font/google';
import Link from 'next/link'; 
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage
} from '~/components/ui/form'
import { Button } from '~/components/ui/button';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['700']
})

export const SignInView = () => {
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
      password: '',
      username: ''
    }
  })

  const onSubmit = (values: z.infer<typeof registerSchema>) => {
    console.log(values)
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