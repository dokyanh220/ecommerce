"use client"

import { useSearchParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { useTRPC } from '~/trpc/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '~/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form'
import { toast } from 'sonner'
import { useState } from 'react'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '~/components/ui/input-otp'

const schema = z.object({
  code: z.string().length(6, 'OTP must be 6 digits'),
})

export const VerifyEmail = () => {
  const params = useSearchParams()
  const email = params.get('email') || ''
  const trpc = useTRPC()
  const router = useRouter()

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { code: '' }
  })

  const verifyMutation = useMutation(
    trpc.auth.verifyEmail.mutationOptions({
      onSuccess: (data) => {
        toast.success(data.message)
        router.push(data.redirect || '/')
      },
      onError: (err) => {
        toast.error(err.message)
      }
    })
  )

  const resendMutation = useMutation(
    trpc.auth.resendEmailOtp.mutationOptions({
      onSuccess: (data) => toast.success(data.message),
      onError: (err) => toast.error(err.message)
    })
  )

  const onSubmit = (values: z.infer<typeof schema>) => {
    if (verifyMutation.isPending) return
    verifyMutation.mutate({
      email,
      code: values.code
    } as any)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-2xl font-semibold">Verify your email</h1>
        <p className="text-sm text-muted-foreground">
          We sent a 6-digit code to <strong>{email}</strong>. Enter it below to activate your account.
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="code"
              render={({ field }) => (
                <FormItem>
                  <InputOTP
                    maxLength={6}
                    value={field.value}
                    onChange={field.onChange}
                    containerClassName="justify-between"
                  >
                    <InputOTPGroup>
                      {[0,1,2,3,4,5].map(i => <InputOTPSlot key={i} index={i} />)}
                    </InputOTPGroup>
                  </InputOTP>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-3">
              <Button
                type="submit"
                variant='elevated'
                className='bg-black text-white hover:bg-pink-400 disabled:opacity-60 disabled:pointer-events-none'
                disabled={verifyMutation.isPending || form.watch('code').length !== 6}
              >
                {verifyMutation.isPending ? 'Verifying...' : 'Verify'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                className='hover:bg-neutral-300'
                disabled={resendMutation.isPending}
                onClick={() => {
                  if (resendMutation.isPending) return
                  resendMutation.mutate({ email } as any)
                }}
              >
                {resendMutation.isPending ? 'Sending...' : 'Resend code'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}