import Account from "@/database/account.model";
import handleError from "@/lib/handlers/error";
import { ForbiddenError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { AccountSchema } from "@/lib/validations";
import { APIErrorResponse } from "@/types/global";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await dbConnect();

        const accounts = await Account.find();

        return NextResponse.json({success: true, data: accounts}, {status:200})
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
        // SafeParse digunakan buat password
        const validatedDate = AccountSchema.parse(body);

        const existingAccount = await Account.findOne({
            // Apakah ada email yang sama
            provider: validatedDate.provider,
            // Apakah ada id yang sama dengan email tadi
            providerAccountId: validatedDate.providerAccountId
        })
        
        if(existingAccount) {
            throw new ForbiddenError("An account with the same provider already exists")
        }

        const newAccount = await Account.create(validatedDate);

        return NextResponse.json({success: true, data: newAccount}, {status: 201})

    } catch (error) {
        return handleError(error, "api") as APIErrorResponse
    }
}