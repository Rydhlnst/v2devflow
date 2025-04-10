"use server"

import Answer, { IAnswerDoc } from "@/database/answer.model";
import { CreateAnswerParams } from "@/types/action";
import { ActionResponse, ErrorResponse } from "@/types/global";
import action from "../handlers/action";
import { AnswerServerSchema } from "../validations";
import handleError from "../handlers/error";
import mongoose from "mongoose";
import { Question } from "@/database";

export async function CreateAnswer(params:CreateAnswerParams): Promise<ActionResponse<IAnswerDoc>> {
    const validationResult = await action({
        params,
        schema: AnswerServerSchema,
        authorize: true
    })

    if(validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse
    }

    const {content, questionId} = validationResult.params!;
    const userId = validationResult?.session?.user?.id;

    const session = await mongoose.startSession();

    try {
        const question = await Question.findById(questionId);
        if(!question) throw new Error("Question not found");

        const [newAnswer] = await Answer.create([
            {
                author: userId,
                question: questionId,
                content
            }
        ], {session})

        if(!newAnswer) throw new Error("Failed to create answer");

        question.answers += 1;
        await question.save({session});

        await session.commitTransaction();

        return {success: true, data: JSON.parse(JSON.stringify(newAnswer))};
    } catch (error) {
        await session.abortTransaction();
        return handleError(error) as ErrorResponse;
    } finally {
        await session.endSession()
    }
}