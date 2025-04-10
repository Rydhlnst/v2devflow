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