
"use server"

import { ActionResponse, ErrorResponse, ICollection, IQuestion, PaginatedSearchParams } from '@/types/global';
import { CollectionBaseParams } from "@/types/action";
import { CollectionBaseSchema, PaginatedSearchParamsSchema } from '../validations';
import action from '../handlers/action';
import handleError from '../handlers/error';
import { Collection, Question } from '@/database';
import { revalidatePath } from 'next/cache';
import ROUTES from '@/constants/routes';
import mongoose, { PipelineStage } from 'mongoose';
import dbConnect from '../mongoose';


export async function toogleSaveQuestion(params: CollectionBaseParams): Promise<ActionResponse<{saved: boolean}>> {
    const validationResult = await action({
        params, schema: CollectionBaseSchema, authorize: true
    })

    if(validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse;
    }

    const {questionId} = validationResult.params!;
    const userId = validationResult.session?.user?.id;

    try {
        const question = await Question.findById(questionId);

        if(!question) {
            throw new Error("Question not found")
        }

        const collection = await Collection.findOne({
            question: questionId,
            author: userId
        })

        if(collection) {
            await Collection.findByIdAndDelete(collection._id);

            revalidatePath(ROUTES.QUESTIONS(questionId));

            return {
                success: true,
                data: {
                    saved: false
                }
            }   
        }

        await Collection.create({
            question: questionId,
            author: userId
        });

        revalidatePath(ROUTES.QUESTIONS(questionId));

        return {
            success: true,
            data: {
                saved: true
            }
        }

    } catch (error) {
        return handleError(error) as ErrorResponse
    }
}

export async function hasSavedQuestion(params: CollectionBaseParams): Promise<ActionResponse<{saved: boolean}>> {
    const validationResult = await action({
        params, schema: CollectionBaseSchema, authorize: true
    })

    if(validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse;
    }

    const {questionId} = validationResult.params!;
    const userId = validationResult.session?.user?.id;

    try {

        const collection = await Collection.findOne({
            question: questionId,
            author: userId
        })

        return {
            success: true,
            data: {
                saved: !!collection // true if collection exists, false otherwise
            }
        }

    } catch (error) {
        return handleError(error) as ErrorResponse
    }
}

export async function getSavedQuestions(params: PaginatedSearchParams): Promise<ActionResponse<{collection: ICollection[], isNext: boolean}>> {
    const validationResult = await action({
        params, schema: PaginatedSearchParamsSchema, authorize: true
    })

    if(validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse
    }

    const userId = validationResult.session?.user?.id;
    const {page = 1, pageSize = 10, query, filter} = params;

    const skip = (Number(page) - 1) * pageSize;
    const limit = Number(pageSize);

    const sortOptions: Record<string, Record<string, 1 | -1>> = {
        mostrecent: {"question.createdAt": -1},
        oldest: {"question.createdAt": 1},
        popular: {"question.upvotes": -1},
        mostviewed: {"question.views": -1},
        mostanswered: {"question.answers": -1},
    };

    const sortCriteria = sortOptions[filter as keyof typeof sortOptions] || {"question.createdAt": -1};

    try {
        const pipeline: PipelineStage[] = [
            {$match: {author: new mongoose.Types.ObjectId(userId)}},
            {$lookup: {
                from: "questions",
                localField: "question",
                foreignField: "_id",
                as: "question"
            }}, 
            {$unwind: "$question"},
            {$lookup: {
                from: "users",
                localField: "question.author",
                foreignField: "_id",
                as: "question.author"
            }},
            {$unwind: "$question.author"},
            {$lookup: {
                from: "tags",
                localField: "question.tags",
                foreignField: "_id",
                as: "question.tags"
            }},
        ];

        if(query) {
            pipeline.push({
                $match: {
                    $or: [
                        {"question.title": {$regex: new RegExp(query, "i")}},
                        {"question.content": {$regex: new RegExp(query, "i")}}
                    ]
                }
            })
        }

        const [totalCount] = await Collection.aggregate([
            ...pipeline, {$count: "count"}
        ])

        pipeline.push(
            {$sort: sortCriteria}, {$skip: skip}, {$limit: limit}
        );

        pipeline.push(
            {$project: {question: 1, author: 1}}
        )

        const question = await Collection.aggregate(pipeline);

        const isNext = totalCount?.count > skip + question.length;

        return {
            success: true,
            data: {
                collection: JSON.parse(JSON.stringify(question)),
                isNext
            }
        }
    } catch (error) {
        return handleError(error) as ErrorResponse

    }
}

export async function getHotQuestions(): Promise<ActionResponse<IQuestion[]>> {
    try {
        await dbConnect();

        const questions = await Question.find().sort({views: -1, upvotes: -1}).limit(5);

        return {
            success: true,
            data: JSON.parse(JSON.stringify(questions))
        }
    } catch (error) {
        return handleError(error) as ErrorResponse
    }
}