import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("MONGODB_URI não definida");
};

let cachedConnection = global.mongooseConnection;

if (!cachedConnection) {
    cachedConnection = global.mongooseConnection = {
        connection: null,
        promise: null
    }
};

export async function connectToDatabase() {
    if (cachedConnection.connection) {
        return cachedConnection.connection;
    };

    if (!cachedConnection.promise) {
        cachedConnection.promise = mongoose.connect(MONGODB_URI);
    };

    cachedConnection.connection = await cachedConnection.promise;

    return cachedConnection.connection;
}

