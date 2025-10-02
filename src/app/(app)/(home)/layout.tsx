import { Footer } from './footer/page'
import { Navbar } from './Navbar'

interface Props {
  children: React.ReactNode
}

const Layout = ({ children }: Props) => {
  return ( 
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className='flex justify-center'>
        {children}
      </div>
      <Footer />
    </div>
  )
}
 
export default Layout