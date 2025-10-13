import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { Footer } from './footer/page'
import { Navbar } from './Navbar'
import { SearchFilter } from './search-filter'
import { CustomCategory } from './types'

interface Props {
  children: React.ReactNode
}

const Layout = async ({ children }: Props) => {
  const payload = await getPayload({
    config: configPromise
  })

  const data = await payload.find({
    collection: 'categories',
    depth: 1, // Populate subcategories, subcategories.[0] will be a type of 'Category'
    pagination: false,
    where: {
      parent: {
        exists: false
      }
    },
    sort: 'name'
  })

  const formattedData = data.docs.map((doc) => ({
    ...doc,
    subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
      // Because of 'depth: 1' we are confident doc will be a type of 'Category'
      ...(doc as CustomCategory),
      subcategories: undefined
    }))
  }))

  return ( 
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <SearchFilter data={formattedData} />
      <div className='flex-1 justify-center bg-[#f4f4f0]'>
        {children}
      </div>
      <Footer />
    </div>
  )
}
 
export default Layout