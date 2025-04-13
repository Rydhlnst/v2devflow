import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

interface Props {
    imgUrl: string;
    href?: string;
    title: string;
}

const ProfileLink = ({imgUrl, href, title}: Props) => {
  return (
    <div className='flex-center gap-1'>
        <Image src={imgUrl} alt={title} width={20} height={20}/>
        {href ? (
            <Link className='paragraph-medium text-link-100' target='_blank' href={href} rel='noopener noreferrer'>
                {title}
            </Link>
        ) : (
            <p className='paragraph-medium text-dark400_light900'>{title}</p>
        )}
    </div>
  )
}

export default ProfileLink