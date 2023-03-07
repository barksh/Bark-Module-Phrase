/**
 * @author WMXPY
 * @namespace Database
 * @description Connect
 */

import * as Mongoose from "mongoose";

Mongoose.set("strictQuery", false);
Mongoose.set("bufferCommands", false);

export const connectDatabase = async (database: string): Promise<Mongoose.Connection> => {

    const connection: typeof Mongoose = await Mongoose.connect(
        database,
        {
            autoCreate: true,
            autoIndex: true,
        },
    );
    return connection.connection;
};
