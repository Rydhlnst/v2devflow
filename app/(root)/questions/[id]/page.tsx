import { RouterParams } from '@/types/global';
import React from 'react'

const QuestionDetails = async ({params}: RouterParams) => {
    const {id} = await params;
  return (
    <div>QuestionDetails: {id}</div>
  )
}

export default QuestionDetails