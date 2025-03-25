import Account from "@/database/account.model";
import User from "@/database/user.model";
import handleError from "@/lib/handlers/error";
import { ValidationError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { SignInWithOAuthSchema } from "@/lib/validations";
import { APIErrorResponse } from "@/types/global";
import mongoose from "mongoose";
import slugify from "slugify"

export async function POST(request: Request) {
    const {provider, providerAccountId, user} = await request.json();

    await dbConnect();

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const validatedData = SignInWithOAuthSchema.safeParse({provider, providerAccountId, user});

        if(!validatedData.success) throw new ValidationError(validatedData.error.flatten().fieldErrors);

        const {name, username, email, image} = user;

        const slugifiedUsername = slugify(username, {
            trim: true,
            strict: true,
            lower: true
        })

        let existingUser = await User.findOne({email}).session(session);

        if(!existingUser) {
            [existingUser] = await User.create([{email, username: slugifiedUsername, image, name}, {session}])
        } else {
            const updatedUser: {name?: string; image?: string} = {};

            if (existingUser.name !== name) updatedUser.name = name;
            if (existingUser.image !== image) updatedUser.image = image;

            if(Object.keys(updatedUser).length > 0) {
                await User.updateOne({_id: existingUser._id}, {$set: updatedUser}).session(session)
            } 
        }

        const existingAccount = await Account.findOne({userId: existingUser._id, provider, providerAccountId}).session(session);

        if(!existingAccount) {
            await Account.create([
               { userId: existingUser._id, name, image, provider, providerAccountId}
            ], {session})
        }

        await session.commitTransaction();

    } catch (error: unknown) {
        await session.abortTransaction();
        return handleError(error, "api") as APIErrorResponse
    } finally {
        session.endSession();
    }
}