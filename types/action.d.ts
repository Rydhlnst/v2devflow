import { PaginatedSearchParams } from "./global";

export interface SignInWithOAuthParams {
    provider: 'github' | "google",
    providerAccountId: string,
    user: {
        name: string,
        email: string,
        image: string,
        username: string,
    }
} 

export interface AuthCredentials {
    name: string,
    username: string;
    email: string;
    password: string;
}

export interface CreateQuestionParams {
    title: string;
    content: string;
    tags: string[];
}

export interface EditQuestionParams extends CreateQuestionParams {
    questionId: string;
}

export interface GetQuestionParams {
    questionId: string
}

export interface GetTagQuestionsParams extends Omit<PaginatedSearchParams, "filter"> {
    tagId: string;
}

export interface IncrementViewsParams {
    questionId: string
}

export interface CreateAnswerParams {
    questionId: string;
    content: string
}

export interface GetAnswersParams extends PaginatedSearchParams {
    questionId: string
}

export interface CreateVoteParams {
    targetId: string;
    targetType: "question" | "answer"
    voteType: "upvote" | "downvote"
}

export interface UpdateVoteCountParams extends CreateVoteParams {
    change: 1 | -1
}

export type HasVotedParams = Pick<CreateVoteParams, "targetId" | "targetType">;

export interface HasVotedResponse {
    hasUpvoted: boolean;
    hasDownvoted: boolean;
}