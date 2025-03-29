

import React from 'react'
import NavLinks from './navbar/NavLinks'
import { Button } from '../ui/button'
import Link from 'next/link'
import ROUTES from '@/constants/routes'
import Image from 'next/image'
import { auth, signOut } from '@/auth'
import { LogOut } from 'lucide-react'

const LeftSideBar = async () => {
    const session = await auth();
    const userId = session?.user?.id;
  return (
    <section className='custom-scrollbar background-light900_dark200 light-border sticky left-0 top-0 h-screen flex flex-col justify-between overflow-y-auto border-r p-6 pt-36 shadow-light-300 dark:shadow-none max-sm:hidden lg:w-[266px]'>
        <div className='flex flex-1 flex-col gap-6'>
            <NavLinks userId={userId}/>
        </div>

        <div className='flex flex-col gap-3'>
            {userId ? (
                <form action={async () => {
                    "use server";
                    
                    await signOut();
                }}>
                    <Button type='submit' className="base-medium w-fit bg-transparent px-4 py-3">
                        <LogOut className='size-5 text-black dark:text-white'/>
                        <span className='base-medium w-fit !bg-transparent max-lg:hidden'>Logout</span>
                    </Button>
                </form>
            ) : (
                <>
                    <Button className='small-medium btn-secondary dark:btn-tertiary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none' asChild>
                        <Link href={ROUTES.SIGN_IN}>
                        <Image src={"/icons/account.svg"} alt='account' width={20} height={20} className='invert-colors lg:hidden'/>
                            <span className='primary-text-gradient max-lg:hidden'>Log In</span>
                        </Link>
                    </Button>
                    <Button className='small-medium text-dark400_light900 light-border-2 border btn-tertiary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none' asChild>
                        <Link href={ROUTES.SIGN_UP}>
                            <Image src={"/icons/sign-up.svg"} alt='sign-up' width={20} height={20} className='invert-colors lg:hidden'/>
                            <span className='max-lg:hidden'>Sign Up</span>
                        </Link>
                    </Button>
                </>
            )}
            
        </div>
    </section>
  )
}

export default LeftSideBar