import ROUTES from '@/constants/routes';
import { getTimeStamp } from '@/lib/utils';
import { IQuestion, ITag } from '@/types/global';
import Link from 'next/link';
import React from 'react'
import TagCards from './TagCards';
import Metric from '../Metric';

interface Props {
    question: IQuestion;
}

const QuestionCards = ({question: {_id, title, tags, author, createdAt, upvotes, answers, views}}: Props) => {
  return (
    <div className='card-wrapper p-9 sm:px-11 rounded-[10px]'>
        <div className='flex flex-col-reverse items-start justify-between gap-5 sm:flex-row'>
            <div>
                <span className='subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden'>{getTimeStamp(createdAt)}</span>
                <Link href={ROUTES.QUESTIONS(_id)}>
                    <h3 className='sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1'>{title}</h3>
                </Link>
            </div>
        </div>

        <div className='mt-3.5 flex w-full flex-wrap gap-2'>
            {tags.map((tag: ITag) => (
                <TagCards key={tag._id} _id={tag._id} name={tag.name} compact questions={0}/>
            ))}
        </div>
        <div className='flex flex-between mt-6 w-full gap-3'>
            <Metric imgUrl={author.image} alt={author.name} value={author.name} title={`+ asked ${getTimeStamp(createdAt)}`} href={ROUTES.PROFILE(author._id)} textStyles="body-medium text-dark400_light700 " isAuthor titleStyles='max-sm:hidden'/>
            <div className='flex items-center gap-3 max-sm:flex-wrap max-sm:justify-start'>
                <Metric imgUrl="/icons/like.svg" alt="upvotes" value={upvotes} title="Votes" textStyles="small-medium text-dark400_light800"/>
                <Metric imgUrl="/icons/message.svg" alt="answers" value={answers} title="Answers" textStyles="small-medium text-dark400_light800"/>
                <Metric imgUrl="/icons/eye.svg" alt="views" value={views} title="Views" textStyles="small-medium text-dark400_light800"/>
            </div>
        </div>
    </div>
  )
}

export default QuestionCards