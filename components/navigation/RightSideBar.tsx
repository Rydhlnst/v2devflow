import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import TagCards from '../cards/TagCards'

const hotQuestions = [
    {_id: "1", title: "How to create a custom hook in React"},
    {_id: "2", title: "How to build a custom hook in React"},
    {_id: "3", title: "How to make a custom hook in React"},
    {_id: "4", title: "How to produce a custom hook in React"},
]

const popularTags = [
    {_id: "1", name: "react", questions: 100},
    {_id: "2", name: "javascript", questions: 100},
    {_id: "3", name: "typescript", questions: 100},
    {_id: "4", name: "nextjs", questions: 100},
    {_id: "5", name: "react-query", questions: 100},
]

const RightSideBar = () => {
  return (
    <section className='pt-36 custom-scrollbar background-light900_dark200 light-border sticky right-0 top-0 flex h-screen w-[350px] flex-col gap-6 overflow-y-auto dark:shadow-none border-l p-6 shadow-light-300 max-xl:hidden'>
        <div>
            <h3 className='h3-bold text-dark200_light900'>Top Questions</h3>
            <div className='mt-7 flex w-full flex-col gap-[30px]'>
                {hotQuestions.map(({_id, title}) => (
                    <Link href={`/questions/${_id}`} key={_id} className='flex cursor-pointer items-center justify-between gap-7'>
                        <p className='body-medium text-dark500_light780'>{title}</p>
                        <Image src={"/icons/chevron-right.svg"} alt='Chevron-right' width={20} height={20} className='invert-colors'/>
                    </Link>
                ))}
            </div>
        </div>
        <div className='mt-16'>
            <h3 className='h3-bold text-dark200_light900'>Popular Tags</h3>
            <div className='mt-7 flex flex-col gap-4'>
                {popularTags.map(({_id, name, questions}) => (
                    <TagCards key={_id} _id={_id} name={name} questions={questions} showCount compact/>
                ))}
            </div>
        </div>
    </section>
  )
}

export default RightSideBar