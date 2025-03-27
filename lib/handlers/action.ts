"use server"

import { ZodError, ZodSchema } from "zod"
import { UnauthorizedError, ValidationError } from "../http-errors";
import { Session } from "next-auth";
import { auth } from "@/auth";
import dbConnect from "../mongoose";

type ActionOptions<T> = {
    params?: T;
    schema: ZodSchema<T>;
    authorize?: boolean;
};

// Checking whether the schema and params are provided and validated// Checkijng whether the schema and params are provided and validated
// Checking whether the user is authorized
// Connecting to database
// Return the params and session 
async function action<T> ({
    params, schema, authorize = false
}: ActionOptions<T>) {
    if(schema && params) {
        try {
            schema.parse(params);
        } catch (error) {
            if(error instanceof ZodError) {
                return new ValidationError(error.flatten().fieldErrors as Record<string, string[]>);
            } else {
                return new Error("Schema validation Failed");
            }
        }
    }

    let session: Session | null = null;

    if(authorize) {
        session = await auth();

        if(!session) {
            return new UnauthorizedError();
        }
    }

    await dbConnect();

    return {params, session};
}

export default action;