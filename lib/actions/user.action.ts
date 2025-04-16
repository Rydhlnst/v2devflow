"use server"
import { GetUserSchema } from './../validations';
import User from '@/database/user.model';
import { FilterQuery, PipelineStage, Types } from 'mongoose';

import { ActionResponse, ErrorResponse, IAnswer, IQuestion, IUser, PaginatedSearchParams } from "@/types/global";
import { PaginatedSearchParamsSchema } from "../validations";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { GetUserAnswersParams, GetUserParams, GetUserQUestionParams, GetUserTagsParams } from '@/types/action';
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

    const {userId} = params

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

export async function getUserQuestions(params: GetUserQUestionParams): Promise<ActionResponse<{questions: IQuestion[], isNext: boolean}>> {
    const validationResult = await action({
        params, schema: GetUserSchema
    })

    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse;
    }

    const {userId, page = 1, pageSize = 10} = params;
    const skip = (Number(page) - 1) * pageSize;
    const limit = pageSize;

    try {

        const totalQuestions = await Question.countDocuments({ author: userId});

        const questions = await Question.find({author: userId}).skip(skip).limit(limit).populate("tags", "name").populate("author", "name image");

        const isNext = totalQuestions > skip + questions.length;

        return {
            success: true,
            data: {
                questions: JSON.parse(JSON.stringify(questions)),
                isNext
            }
        }
    } catch (error) {
        return handleError(error) as ErrorResponse
    }
}

export async function getUsersAnswers(params: GetUserAnswersParams): Promise<
  ActionResponse<{
    answers: IAnswer[];
    isNext: boolean;
  }>
> {
  const validationResult = await action({
    params,
    schema: GetUserSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { userId, page = 1, pageSize = 10 } = params;

  const skip = (Number(page) - 1) * pageSize;
  const limit = pageSize;

  try {
    const totalAnswers = await Answer.countDocuments({ author: userId });

    const answers = await Answer.find({ author: userId })
      .populate("author", "_id name image")
      .skip(skip)
      .limit(limit);

    const isNext = totalAnswers > skip + answers.length;

    return {
      success: true,
      data: {
        answers: JSON.parse(JSON.stringify(answers)),
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getUsersTopTags(params: GetUserTagsParams): Promise<
  ActionResponse<{
    tags: {_id: string, name: string, count: number}[];
  }>
> {
  const validationResult = await action({
    params,
    schema: GetUserSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { userId } = params;

  try {
    const pipeline: PipelineStage[] = [
        {$match: {author: new Types.ObjectId(userId)}},
        {$unwind: "$tags"},
        {$group: {_id: "$tags", count: {$sum: 1}}},
        {$lookup: {
            from: "tags",
            localField: "_id",
            foreignField: "_id",
            as: "tagInfo"
        }},
        {$unwind: "$tagInfo"},
        {$sort: {count: -1}},
        {$limit: 10},
        {$project: {
            _id: "$tagInfo._id",
            name: "$tagInfo.name",
            count: 1
        }}
    ]

    const tags = await Question.aggregate(pipeline);

    return {
        success: true,
        data: {
            tags: JSON.parse(JSON.stringify(tags))
        }
    }

  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}