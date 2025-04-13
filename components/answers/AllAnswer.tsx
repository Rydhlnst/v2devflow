import { ActionResponse, IAnswer } from '@/types/global'
import React from 'react'
import DataRenderer from '../DataRenderer';
import { EMPTY_ANSWERS } from '@/constants/states';
import AnswerCard from '../cards/AnswerCard';
import CommonFilter from '../filters/CommonFilter';
import { AnswerFilters } from '@/constants/filter';
import Pagination from '../Pagination';

interface Props extends ActionResponse<IAnswer[]> {
    totalAnswers: number;
    page: number;
    isNext: boolean
}

const AllAnswer = ({data, success, error, totalAnswers, page, isNext}: Props) => {
  return (
    <div className='mt-11'>
        <div className='flex items-center justify-between'>
            <h3 className='primary-text-gradient'>
                {totalAnswers} {totalAnswers >= 1 ? "Answer" : totalAnswers === 0 ? "Answer" : "Answers"}
            </h3>
            <CommonFilter filters={AnswerFilters} otherClasses={"sm:min-w-32"} containerClasses='max-xs:w-full'/>
        </div>
        <DataRenderer
            data={data}
            error={error}
            success={success}
            empty={EMPTY_ANSWERS}
            render={(answers) => answers.map((answer) => <AnswerCard key={answer._id} {...answer}/>)}
        />
        <Pagination isNext={isNext} page={page}/>
    </div>
  )
}

export default AllAnswer