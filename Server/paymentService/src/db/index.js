import mongoose from "mongoose";
import { DB_NAME } from '../constants.js';
import Env from "../config/confo.js";



//mongoDb connection


const connectDB = async () => {
    console.log("MongoDb connection");
    try {
        mongoose.set('strictQuery', false);

        await mongoose.connect(`${Env.MONGODB_URI}/${DB_NAME}`).then(() => {
            console.log("Database is connected", mongoose.connection.host);

        });


    } catch (error) {
        console.log("MongoDb connection Fail", error);
        process.exit(1);
    }
};

export default connectDB;
