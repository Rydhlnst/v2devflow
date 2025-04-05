import { auth } from '@/auth'
import QuestionForm from '@/components/forms/QuestionForm'
import ROUTES from '@/constants/routes';
import { getQuestion } from '@/lib/actions/question.action';
import { RouterParams } from '@/types/global';
import { notFound, redirect } from 'next/navigation';
import React from 'react'

const EditQuestion = async ({params}: RouterParams) => {
    const {id} = await params;
    if(!id) return notFound();
    const session = await auth();
    if (!session) return redirect("/sign-in");
    const {data: question, success} = await getQuestion({questionId: id});
    if(!success) return notFound();

    if(question?.author.toString() !== session?.user?.id) redirect(ROUTES.QUESTIONS(id)) 
  return (
    <main>
      <QuestionForm question={question} isEdit/>
    </main>
  )
}

export default EditQuestion