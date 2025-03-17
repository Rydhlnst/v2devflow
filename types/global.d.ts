import { NextResponse } from "next/server";

interface Tag {
    _id: string;
    name: string;
}

interface Author {
    _id: string;
    name: string;
    image: string;
}

interface Question {
    _id: string;
    title: string;
    tags: {_id: string; name: string}[];
    tags: Tag[];
    author: Author;
    createdAt: Date;
    upvotes: number;
    answers: number;
    views: number;
}

type ActionResponse<T = null> = {
    success: boolean;
    data?: T;
    error?: {
        message: string;
        details?: Record<string, stringp[]>;
    },
    status: number;
}

type SuccessResponse<T = null> = ActionResponse<T> & {success: true};
type ErrorResponse = ActionResponse<undefined> & {success: false};

type APIErrorResponse = NextResponse<ErrorResponse>;
type APIResponse<T = null> = NextResponse<SuccessResponse<T> | ErrorResponse>;

export {Question, Tag, Author}
export type {APIErrorResponse, APIResponse}