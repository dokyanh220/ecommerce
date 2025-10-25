import { redirect } from "next/navigation"
import { SignInView } from "~/modules/auth/ui/view/sign-in-view"
import { caller } from "~/trpc/server"

const Page = async () => {
  // session chứa thông tin user đã đăng nhập
  const session = await caller.auth.session()

  // Nếu session tồn tại thông tin user
  if (session.user) {
    redirect('/')
  }

  return <SignInView />
}
 
export default Page