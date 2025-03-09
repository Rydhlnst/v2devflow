import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Theme } from './Theme'

const Navbar = () => {
  return (
    <nav className='flex-between background-light900_dark200 fixe z-50 w-full p-6 shadow-none dark:shadown-none sm:px-12'>
        <Link href={""} className='flex items-center gap-1'>
            <Image src={"/images/site-logo.svg"} width={23} height={23} alt='DevFlow Logo'/>
            <p className='h2-bold dark:text-light-900 max-sm:hidden font-space-grotesk text-dark-100'>
                Dev<span className='text-primary-500 '>Flow</span>
            </p>
        </Link>
        <p>Global Search</p>
        <div className='flex-between gap-5'>
            <Theme/>
        </div>
    </nav>
  )
}

export default Navbar