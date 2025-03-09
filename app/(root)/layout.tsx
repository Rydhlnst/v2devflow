import Navbar from '@/components/navigation/navbar/Navbar'
import React, { ReactNode } from 'react'

const RootLayout = ({children}: {children: ReactNode}) => {
  return (
    <main>
        <Navbar/>
        {children}
    </main>
  )
}

export default RootLayout