import User from "@/database/user.model";
import handleError from "@/lib/handlers/error";
import { NotFoundError, ValidationError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { UserSchema } from "@/lib/validations";
import { APIErrorResponse } from "@/types/global";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const {email} = await request.json();

    try {
        await dbConnect();

        const validatedDate = UserSchema.partial().safeParse({email});

        if(!validatedDate.success) throw new ValidationError(validatedDate.error.flatten().fieldErrors);

        const user = await User.findOne({email});
        if(!user) throw new NotFoundError("User");

        return NextResponse.json({
            success: true,
            data: user
        }, {
            status: 200
        })
    } catch (error) {
        return handleError(error, "api") as APIErrorResponse;
    }
}