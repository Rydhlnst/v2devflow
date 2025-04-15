import { auth } from '@/auth';
import ProfileLink from '@/components/user/ProfileLink';
import UserAvatar from '@/components/UserAvatar';
import { getUser, getUserQuestions, getUserAnswers } from '@/lib/actions/user.action'
import { RouterParams } from '@/types/global'
import { notFound } from 'next/navigation';
import dayjs from 'dayjs';
import React from 'react'
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Stats from '@/components/user/Stats';
import { Tabs, TabsContent, TabsTrigger } from '@/components/ui/tabs';
import { TabsList } from '@radix-ui/react-tabs';
import { EMPTY_ANSWERS, EMPTY_QUESTIONS } from '@/constants/states';
import DataRenderer from '@/components/DataRenderer';
import QuestionCards from '@/components/cards/QuestionCards';
import Pagination from '@/components/Pagination';
import AnswerCard from '@/components/cards/AnswerCard';

const UserPage = async ({params, searchParams}: RouterParams) => {
  const {id} = await params;
  const {page, pageSize} = await searchParams;

  if(!id) notFound();

  const loggedInUser = await auth();

  const {success, data, error} = await getUser({
    userId: id
  })

  if(!success) return <div>
    <div className='h1-bold text-dark100_light900'>
      {error?.message}
    </div>
  </div>

  const {user, totalQuestions, totalAnswers} = data!;

  const {success: userQuestionSuccess, data: userQuestions, error: userQuestionError} = await getUserQuestions({
    userId: id,
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10
  });

  
  const {success: successQuestionAnswers, data: userAnswers, error: errorQuestionAnswer} = await getUserAnswers({
    userId: id,
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10
  });
  
  const {questions, isNext: hasMoreQuestions} = userQuestions!;
  const {answers, isNext: hasMoreAnswers} = userAnswers!;
  return (
    <>
    
      <section className='flex flex-col-reverse items-start justify-between sm:flex-row'>
          <div className='flex flex-col items-start gap-4 lg:flex-row'>
            <UserAvatar id={user._id} name={user.name} imageUrl={user.image} className='size-[140px] rounded-full object-cover' fallbackClassName='text-6xl font-bolder'/>
            <div className='mt-3'>
              <h2 className='h2-bold text-dark100_light900'>{user.name}</h2>
              <p className='paragraph-regular text-dark200_light800'>@{user.username}</p>

              <div className='mt-5 flex flex-wrap items-center justify-start gap-5'>
                {user.portfolio && (
                  <ProfileLink imgUrl="/icons/link.svg" href={user.portfolio} title="Portfolio"/>
                )}
                {user.location && (
                  <ProfileLink imgUrl="/icons/location.svg" href={user.location} title="Portfolio"/>
                )}
                <ProfileLink imgUrl="/icons/calendar.svg" title={dayjs(user.createdAt).format("MMMM YYYY")}/>
              </div>

              {user.bio && (
                <p className='paragraph-regulat text-dark400_light800 mt-8'>{user.bio}</p>
              )}
            </div>
          </div>
          <div className='flex justify-end max-sm:mb-8 max-sm:w-full sm:mt-3'>
            {loggedInUser?.user?.id === id && (
              <Link href={"/profile/edit"}>
                <Button className='paragraph-medium btn-secondary text-dark300_light900 min-h-12 min-w-44 px-4 py-3'>Edit Profile</Button>
              </Link>
            )}
          </div>
      </section>
      <Stats totalQuestions={totalQuestions} totalAnswers={totalAnswers} badges={{GOLD: 0, SILVER: 0, BRONZE: 0}}/>
      <section className='mt-10 flex gap-10'>
          <Tabs defaultValue="top-posts" className="flex-[2]">
            <TabsList className=" min-h-[42px] p-1 flex gap-2 w-[50%]">
              <TabsTrigger value="top-posts" className='tab'>Top Posts</TabsTrigger>
              <TabsTrigger value="answers" className='tab'>Answers</TabsTrigger>
            </TabsList>
            <TabsContent value='top-posts' className='mt-5 flex w-full flex-col gap-6'>
              <DataRenderer data={questions} success={userQuestionSuccess} empty={EMPTY_QUESTIONS} error={userQuestionError} render={(questions) => (
                <div className='flex w-full flex-col gap-6'>
                    {questions.map((question) => (
                      <QuestionCards question={question} key={question._id}/>
                    ))}
                </div>
            )}/>
            <Pagination page={page} isNext={hasMoreQuestions}/>
            </TabsContent>
            <TabsContent value='answers' className='mt-5 flex w-full flex-col gap-6'>
              <DataRenderer data={answers} success={successQuestionAnswers} empty={EMPTY_ANSWERS} error={errorQuestionAnswer} render={(answers) => (
                <div className='flex w-full flex-col gap-6'>
                    {answers.map((answer) => (
                      <AnswerCard key={answer._id} {...answer} content={answer.content.slice(0,27)} containerClasses="card-wrapper rounded-[10px] px-7 py-9 sm:px-11" showReadMore/>
                    ))}
                </div>
            )}/>
            <Pagination page={page} isNext={hasMoreAnswers || false}/>
            </TabsContent>
          </Tabs>
          <div className='flex w-full min-2-[250px] flex-1 flex-col max-lg:hidden'>
              <h3 className='h3-bold text-dark200_light900'>Top Tags</h3>
              <div className='mt-7 flex flex-col gap-4'>
                <p>List of tags</p>
              </div>
          </div>
      </section>
    </>
  )
}

export default UserPage