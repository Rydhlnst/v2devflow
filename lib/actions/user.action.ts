import { GetUserSchema } from './../validations';
"use server"
import User from '@/database/user.model';
import { FilterQuery } from 'mongoose';

import { ActionResponse, ErrorResponse, IUser, PaginatedSearchParams } from "@/types/global";
import { PaginatedSearchParamsSchema } from "../validations";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { GetUserParams } from '@/types/action';
import { Answer, Question } from '@/database';

export async function getUsers(params: PaginatedSearchParams): Promise<ActionResponse<{users: IUser[], isNext: boolean}>> {
    const validationresult = await action({
        schema: PaginatedSearchParamsSchema, params
    })

    if(validationresult instanceof Error) {
        return handleError(validationresult) as ErrorResponse
    }

    const {page = 1, pageSize = 10, query, filter} = params;

    const skip = (Number(page) - 1) * pageSize;
    const limit = Number(pageSize);

    const FilterQuery: FilterQuery<typeof User> = {};
    
    if (query) {
        FilterQuery.$or = [
            {name: {$regex: query, $options: "1"}},
            {email: {$regex: query, $options: "1"}}
        ]
    }

    let sortCriteria = {};

    switch(filter) {
        case "newest": sortCriteria = {createdAt: -1}; break;
        case "oldest": sortCriteria = {createdAt: 1}; break;
        case "popular": sortCriteria = {reputation: -1}; break;
        default: sortCriteria = {createdAt: -1}; break;
    }

    try {
        const totalUsers = await User.countDocuments(FilterQuery);

        const users = await User.find(FilterQuery).sort(sortCriteria).skip(skip).limit(limit);

        const isNext = totalUsers > skip + users.length;

        return {
            success: true, data: {
                users: JSON.parse(JSON.stringify(users)),
                isNext
            }
        }
    } catch (error) {
        return handleError(error) as ErrorResponse;
    }
}

export async function getUser(params: GetUserParams): Promise<ActionResponse<{user: IUser, totalQuestions: number, totalAnswers: number}>> {
    const validationResult = await action({
        params, schema: GetUserSchema
    })

    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse;
    }

    const userId = params

    try {
        const user = await User.findById(userId);

        if(!user) throw new Error("User not found");

        const totalQuestions = await Question.countDocuments({ author: userId});
        const totalAnswers = await Answer.countDocuments({ author: userId});

        return {
            success: true,
            data: {
                user: JSON.parse(JSON.stringify(user)),
                totalAnswers,
                totalQuestions
            }
        }
    } catch (error) {
        return handleError(error) as ErrorResponse
    }
}