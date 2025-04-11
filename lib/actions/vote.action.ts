"use server"

import { CreateVoteParams, UpdateVoteCountParams } from "@/types/action";
import { ActionResponse, ErrorResponse } from "@/types/global";
import action from "../handlers/action";
import { CreateVoteSchema, UpdateVoteCountSchema } from "../validations";
import handleError from "../handlers/error";
import mongoose, { ClientSession } from "mongoose"
import { Answer, Question, Vote } from "@/database";

async function updateVoteCount(params: UpdateVoteCountParams, session?: ClientSession): Promise<ActionResponse> {
    const validationResult = await action({
        params, schema: UpdateVoteCountSchema
    })

    if(validationResult instanceof Error) {
        return handleError(validationResult) as ActionResponse
    }

    const {targetId, targetType, voteType, change} = validationResult.params!;

    const Model = targetType === "question" ? Question : Answer;
    const voteField = voteType === "upvote" ? "upvotes" : "downvotes";

    try {
        const result = await Model.findByIdAndUpdate(targetId, 
            {$inc: {[voteField]: change}},
            {new: true, session}
        );

        if(!result) return handleError(new Error("Failed to update vote count")) as ErrorResponse

        return {success: true};
    } catch (error) {
        return handleError(error) as ErrorResponse
    }
}

async function createVote(params: CreateVoteParams): Promise<ActionResponse> {
    const validationResult = await action({
        params, schema: CreateVoteSchema, authorize: true
    })

    if(validationResult instanceof Error) {
        return handleError(validationResult) as ActionResponse
    }

    const {targetId, targetType, voteType} = validationResult.params!;
    const userId = validationResult.session?.user?.id;

    if(!userId) handleError(new Error("Unauthorized")) as ErrorResponse;

    const session = await mongoose.startSession();

    try {
        const existingVote = await Vote.findOne({
            author: userId,
            actionId: targetId,
            actionType: targetType
        }).session(session)

        if(existingVote) {
            if(existingVote.voteType === voteType) {
                await Vote.deleteOne({_id: existingVote._id}).session(session);
                await updateVoteCount({targetId, targetType, voteType, change: -1}, session);
            } else {
                await Vote.findByIdAndUpdate(existingVote._id, {voteType}, {new: true, session});
                await updateVoteCount({targetId, targetType, voteType, change: 1}, session);
            }
        } else {
            await Vote.create([{targetId, targetType, voteType, change: 1}], {session});
            await updateVoteCount({targetId, targetType, voteType, change: 1}, session);
        } 

        await session.commitTransaction();
        session.endSession();

        return {success: true}
        
    } catch (error) {
        await session.abortTransaction()
        session.endSession();
        return handleError(error) as ErrorResponse
    }
}