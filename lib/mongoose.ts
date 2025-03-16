import { error } from "console";
import mongoose, {Mongoose} from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
    throw new Error("MongoDB URI is missing")
}

interface MongooseCache {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
}

declare global {
    // eslint-disable-next-line no-var
    var mongoose: MongooseCache;
}

let cached = global.mongoose;

if(!cached) {
    cached = global.mongoose = {conn: null, promise: null}
}


const dbConnect = async ():Promise<Mongoose> => {
    if(cached.conn) {
        return cached.conn;
    }
    
    if(!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, {
            dbName: "devflow"
        })
        .then((result) => {
            console.log("Connect to Mongo DB");
            return result;
        })
        .catch((error) => {
            console.log("Error connecting to Mongo DB", error);
            throw error;
        });
    }

    cached.conn = await cached.promise;

    return cached.conn;
};

export default dbConnect;