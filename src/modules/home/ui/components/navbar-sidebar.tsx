import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle
} from '~/components/ui/sheet'
import { ScrollArea } from '~/components/ui/scroll-area'
import Link from 'next/link'
import { useTRPC } from '~/trpc/client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Button } from '~/components/ui/button'
import { LogOut } from 'lucide-react'

interface NavbarItem {
  href: string,
  children: React.ReactNode
}

interface Props {
  items: NavbarItem[],
  open: boolean,
  onOpenChange: (open: boolean) => void
}

export const NavbarSidebar = ({
  items,
  open,
  onOpenChange
}: Props) => {
  const trpc = useTRPC()
  const session = useQuery(trpc.auth.session.queryOptions())
  const queryClient = useQueryClient()
  const router = useRouter()
  

  // Mutation đăng xuất 
  const logoutMutation = useMutation(
    trpc.auth.logout.mutationOptions({
      onSuccess: async () => {
        toast.success('Logged out successfully! See you')
        // form.reset()
        await queryClient.invalidateQueries(trpc.auth.session.queryFilter())
        router.push('/')
      },
      onError: (error) => {
        toast.error(error.message)
      }
    })
  )

  const handleLogout = () => {
    if (logoutMutation.isPending) return
    logoutMutation.mutate()
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side='left'
        className='p-0 transition-none'
      >
          <SheetHeader className='p-4 border-b'>
            <div className='flex items-center'>
              <SheetTitle>
                BizMart
              </SheetTitle>
            </div>
          </SheetHeader>
          <ScrollArea className='flex flex-col overflow-y-auto h-full pb-2 relative'>
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className='w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium'
                onClick={() => onOpenChange(false)}
              >
                {item.children}
              </Link>
            ))}
            {session.data?.user
              ? (
                <div className='border-t'>
                  <Link prefetch onClick={() => onOpenChange(false)} href='/admin' className='w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium'>
                    Dashboard
                  </Link>
                  <Button
                    onClick={handleLogout}
                    disabled={logoutMutation.isPending}
                    className='rounded-none py-6 absolute bottom-2 right-2 border-none bg-transparent hover:scale-135 hover:bg-transparent disabled:opacity-50'
                  >
                    <LogOut size={16} color='black' />
                  </Button>
                </div>
              )
              : (
                <div className='border-t'>
                  <Link prefetch onClick={() => onOpenChange(false)} href='/sign-in' className='w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium'>
                    Log in
                  </Link>
                  <Link prefetch onClick={() => onOpenChange(false)} href='/sign-up' className='w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium'>
                    Sign up
                  </Link>
                </div>
              )
            }
          </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}