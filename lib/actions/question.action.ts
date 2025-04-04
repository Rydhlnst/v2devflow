"use server"

import { CreateQuestionParams } from "@/types/action";
import { ActionResponse, ErrorResponse } from "@/types/global";
import action from "../handlers/action";
import { QuestionSchema } from "../validations";
import handleError from "../handlers/error";
import mongoose from "mongoose"
import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import TagQuestion from "@/database/tag-question.model";


export async function createQuestion(params: CreateQuestionParams): Promise<ActionResponse<Question>> {
    // Only authorized can create question
    const validationResult = await action({params, schema: QuestionSchema, authorize: true});

    if(validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse;
    }

    const {title, content, tags} = validationResult.params!;
    const userId = validationResult?.session?.user?.id;

    // Make sure we use atomic transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const [question] = await Question.create([{title, content, author: userId}], {session});

        if(!question) {
            throw new Error("Failed to create question");
        }

        const tagIds: mongoose.Types.ObjectId[] = [];
        const tagQuestionDocuments = [];

        for(const tag of tags) {
            const exisitingTag = await Tag.findOneAndUpdate({
                name: {$regex: new RegExp(`^${tag}$`, "i")}},
                {$setOnInsert: {name: tag}, $inc: {questions: 1}}, {upsert: true, new: true, session}
            );

            tagIds.push(exisitingTag._id);
            tagQuestionDocuments.push({
                tag: exisitingTag._id,
                question: question._id
            })
        }

        await TagQuestion.insertMany(tagQuestionDocuments, {session});

        await Question.findByIdAndUpdate(question._id, {$push: {tags: {$each: tagIds}}}, {session});

        await session.commitTransaction();

        return {success: true, data: JSON.parse(JSON.stringify(question))}

    } catch (error) {
        await session.abortTransaction();
        return handleError(error) as ErrorResponse;
    } finally {
        session.endSession();
    }
}
