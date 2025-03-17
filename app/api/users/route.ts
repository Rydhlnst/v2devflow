import User from "@/database/user.model";
import handleError from "@/lib/handlers/error";
import { ValidationError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { UserSchema } from "@/lib/validations";
import { APIErrorResponse } from "@/types/global";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await dbConnect();

        const users = await User.find();

        return NextResponse.json({success: true, data: users}, {status:200})
    } catch (error) {
        return handleError(error, "api") as APIErrorResponse
    }
}

// Create User
export async function POST(request: Request) {
    try {
        await dbConnect();

        // Mengambil data dari body
        const body = await request.json();

        // UserSchema yang terbuat dari Zod
        const validatedDate = UserSchema.safeParse(body);

        if(!validatedDate.success) {
            throw new ValidationError(validatedDate.error.flatten().fieldErrors)
        }

        // Destructure
        const {email, username} = validatedDate.data;

        // User diambil dari model
        const existingUser = await User.findOne({email});

        if(existingUser) {
            throw new Error("User already exists")
        }

        const existingUsername = await User.findOne({username})
        if(existingUsername) {
            throw new Error("Username already exists")
        }

        const newUser = await User.create(validatedDate.data);

        return NextResponse.json({success: true, data: newUser}, {status: 201})

    } catch (error) {
        return handleError(error, "api") as APIErrorResponse
    }
}