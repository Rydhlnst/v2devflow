import React from 'react'
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
import Image from 'next/image'
import Link from 'next/link'
import ROUTES from '@/constants/routes'
import { Button } from '@/components/ui/button'
import NavLinks from './NavLinks'
import { auth, signOut } from '@/auth'
import { LogOut } from 'lucide-react'
  

const MobileNavbar = async () => {
    const session = await auth();
    const userId = session?.user?.id;
  return (
    <Sheet>
        <SheetTrigger asChild>
            <Image src={"/icons/hamburger.svg"} width={36} height={36} alt='Menu' className='invert-colors sm:hidden'/>
        </SheetTrigger>
        <SheetContent side='left' className='background-light900_dark200 border-none p-5'>
            <SheetTitle className='hidden'>Are you absolutely sure?</SheetTitle>
                <Link href={"/"} className='flex items-center gap-1'>
                    <Image src={"/images/site-logo.svg"} width={23} height={23} alt='logo'/>
                    <p className='h2-bold font-space-grotesk text-dark-100 dark:text-light-900'>Dev<span className='text-primary-500'>Flow</span></p>
                </Link>
                <div className='no-scrollbar flex h-[calc(100vh-80px)] flex-col jusitfy-between overflow-y-auto '>
                    <SheetClose asChild>
                        <section className='flex h-full flex-col gap-6 pt-16'>
                            <NavLinks isMobileNav={true}/>
                        </section>
                    </SheetClose>
                    <div className='flex flex-col gap-3'>
                        {userId ? (
                            <SheetClose asChild>
                               <form action={async () => {
                                    "use server";
                                    
                                    await signOut();
                                }}>
                                    <Button type='submit' className="base-medium w-fit bg-transparent px-4 py-3">
                                        <LogOut className='size-5 text-black dark:text-white'/>
                                        <span className='base-medium w-fit !bg-transparent '>Logout</span>
                                    </Button>
                                </form>
                            </SheetClose>
                        ) : (
                            <>
                                 <SheetClose asChild>
                                    <Link href={ROUTES.SIGN_IN}>
                                        <Button className='small-medium btn-secondary dark:btn-tertiary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none'>
                                            <span className='primary-text-gradient'>Log In</span>
                                        </Button>
                                    </Link>
                                </SheetClose>
                                <SheetClose asChild>
                                    <Link href={ROUTES.SIGN_UP}>
                                        <Button className='small-medium text-dark400_light900 light-border-2 border btn-tertiary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none'>
                                            Sign Up
                                        </Button>
                                    </Link>
                                </SheetClose>
                            </>
                        )}
                       
                    </div>
                </div>
            </SheetContent>
        </Sheet>

  )
}

export default MobileNavbar