import { redirect } from "next/navigation"
import { SignUpView } from "~/modules/auth/ui/view/sign-up-view"
import { caller } from "~/trpc/server"

const Page = async () => {
  // session chứa thông tin user đã đăng nhập
  const session = await caller.auth.session()

  // Nếu session tồn tại thông tin user
  if (session.user) {
    redirect('/')
  }

  return <SignUpView />
}
 
export default Page