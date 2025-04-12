
"use server"

import { ActionResponse, ErrorResponse } from '@/types/global';
import { CollectionBaseParams } from "@/types/action";
import { CollectionBaseSchema } from '../validations';
import action from '../handlers/action';
import handleError from '../handlers/error';
import { Collection, Question } from '@/database';
import { revalidatePath } from 'next/cache';
import ROUTES from '@/constants/routes';

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
