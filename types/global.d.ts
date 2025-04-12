
import { NextResponse } from "next/server";

interface ITag {
    _id: string;
    name: string;
}

interface Author {
    _id: string;
    name: string;
    image: string;
}

interface IQuestion {
    _id: string;
    title: string;
    content: string;
    tags: {_id: string; name: string}[];
    tags: Tag[];
    author: Author;
    createdAt: Date;
    upvotes: number;
    downvotes: number;
    answers: number;
    views: number;
}

type ActionResponse<T = null> = {
    success: boolean;
    data?: T;
    error?: {
      message: string;
      details?: Record<string, string[]>;
    };
    status?: number;
  };

type SuccessResponse<T = null> = ActionResponse<T> & {success: true};
type ErrorResponse = ActionResponse<undefined> & {success: false};

type APIErrorResponse = NextResponse<ErrorResponse>;
type APIResponse<T = null> = NextResponse<SuccessResponse<T> | ErrorResponse>;

export {IQuestion, ITag, Author}
export type {APIErrorResponse, APIResponse, ActionResponse, ErrorResponse}

interface RouterParams {
  params: Promise<Record<string, string>>;
  // Params: /questions/:id
  searchParams: Promise<Record<string, string>>;
  // SearchParams: /questions?tag=javascript
}

// Interface for paginated
interface PaginatedSearchParams {
  page?: number;
  pageSize?: number;
  query?: string;
  filter?: string;
  sort?: string
}

interface IAnswer {
  _id: string;
  author: Author;
  content: string;
  createdAt: Date;
  upvotes: number;
  downvotes: number
}

interface ICollection {
  _id: string;
  author: string | Author;
  question: IQuestion
}


export {ICollection, RouterParams, PaginatedSearchParams, IAnswer}