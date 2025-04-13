import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { getHotQuestions } from '@/lib/actions/collection.action'
import DataRenderer from '../DataRenderer'
import ROUTES from '@/constants/routes'
import { getTopTags } from '@/lib/actions/tag.action'
import TagCards from '../cards/TagCards'

const RightSideBar = async () => {

    const [
        {success, data: hotQuestions, error},
        {success: tagSuccess, data: tags, error:tagError}
    ] = await Promise.all([getHotQuestions(), getTopTags()])

  return (
    <section className='pt-36 custom-scrollbar background-light900_dark200 light-border sticky right-0 top-0 flex h-screen w-[350px] flex-col gap-6 overflow-y-auto dark:shadow-none border-l p-6 shadow-light-300 max-xl:hidden'>
        <div>
            <h3 className='h3-bold text-dark200_light900'>Top Questions</h3>
            <DataRenderer data={hotQuestions} success={success} empty={{
                title: "No Questions Found",
                message: "There are no questions found in this collection.",
            }} error={error} render={(hotQuestions) => (
                <div className='mt-7 flex w-full flex-col gap-[30px]'>
                    {hotQuestions.map(({_id, title}) => (
                    <Link href={ROUTES.QUESTIONS(_id)} key={_id} className='flex cursor-pointer items-center justify-between gap-7'>
                        <p className='body-medium text-dark500_light780 line-clamp-2'>{title}</p>
                        <Image src={"/icons/chevron-right.svg"} alt='Chevron-right' width={20} height={20} className='invert-colors'/>
                    </Link>
                ))}
                </div>
            )}/>
        </div>
        <div className='mt-16'>
            <h3 className='h3-bold text-dark200_light900'>Popular Tags</h3>
            <DataRenderer data={tags} error={tagError} success={tagSuccess} empty={{
                title: "No Tags Found", message: "There are no tags found in this collection.",
            }} render={(tags) => (
                <div className='mt-7 flex w-full flex-col gap-4'>
                    {tags.map(({_id, name, questions}) => (
                    <TagCards key={_id} _id={_id} name={name} questions={questions} showCount compact/>
                ))}
                </div>
            )}/>
        </div>
    </section>
  )
}

export default RightSideBar