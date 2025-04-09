import { notFound, redirect } from "next/navigation";
import React from "react";

import { auth } from "@/auth";
import QuestionForm from "@/components/forms/QuestionForm";
import ROUTES from "@/constants/routes";
import { getQuestion } from "@/lib/actions/question.action";
import { RouterParams } from "@/types/global";

const EditQuestion = async ({ params }: RouterParams) => {
  const { id } =await params;  // No need for 'await' on params
  if (!id) return notFound();

  const session = await auth();
  if (!session || !session.user?.id) return redirect("/sign-in");

  const { data: question, success } = await getQuestion({ questionId: id });
  if (!success || !question) return notFound();

  // Debugging Session User and Question Author
  console.log("Question Author:", question.author, "Type:", typeof question.author);
  console.log("Session User ID:", session.user.id, "Type:", typeof session.user.id);
  console.log("Equality Check:", question.author._id === session.user.id);

  if (question.author._id !== session.user.id) {
    return redirect(ROUTES.QUESTIONS(id));  // Return to prevent execution
  }else{
    return (
      <main>
        <QuestionForm question={question} isEdit={true} />
      </main>
    );
  }

  // return (
  //   <main>
  //     <QuestionForm question={question} isEdit={true} />
  //   </main>
  // );
};

export default EditQuestion;