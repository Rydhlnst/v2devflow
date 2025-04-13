import QuestionCards from '@/components/cards/QuestionCards';
import DataRenderer from '@/components/DataRenderer';
import CommonFilter from '@/components/filters/CommonFilter';
import HomeFilter from '@/components/filters/HomeFilter';
import Pagination from '@/components/Pagination';
import LocalSearch from '@/components/search/LocalSearch';
import { HomePageFilters } from '@/constants/filter';
import ROUTES from '@/constants/routes';
import { EMPTY_QUESTIONS } from '@/constants/states';
import { getTagQuestions } from '@/lib/actions/tag.action';
import { RouterParams } from '@/types/global'
import React from 'react'

const Page = async ({searchParams, params}: RouterParams) => {
    const {id} = await params;
    const {page, pageSize, query} = await searchParams;

    const {success, data, error } = await getTagQuestions({
        page: Number(page) || 1,
        tagId: id,
        pageSize: Number(pageSize) || 10,
        query
    })

    const {tag, questions} = data || {};

  return (
    <>
    <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
      <h1 className="">
        {tag?.name}
      </h1>
    </section>
    <section className='mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center'>
      <LocalSearch 
        imgSrc={"/icons/search.svg"} placeholder="Search questions..." route={ROUTES.TAG(id)} otherClasses="flex-1" iconPosition="left"
      />
      <CommonFilter filters={HomePageFilters} otherClasses="min-h-[56px] sm:min-w-[170px]"/>
    </section>
    <HomeFilter/>
    <DataRenderer
      success={success}
      error={error}
      data={questions}
      empty={EMPTY_QUESTIONS}
      render={(questions) => (
        <div className="mt-10 flex w-full flex-col gap-6">
          {questions.map((question) => (
            <QuestionCards key={question._id} question={question}/>
          ))}
        </div>
      )}
    />
    <Pagination isNext={data?.isNext || false} page={page}/>
  </>
  )
}

export default Page