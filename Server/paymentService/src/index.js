import connectDB from "./db/index.js";
import dotenv from "dotenv";
import { app } from "./app.js";
import Env from "./config/confo.js";

//path to env

dotenv.config({
    path: '../env'
})

connectDB().then(() => {
    app.on('error', (err) => {
        console.log(`Server error ${err}`);
        process.exit(1);
    })
    app.listen(Env.PORT, () => {
        console.log(`Server is running on port ${Env.PORT}`);
    })
}).catch((err) => {
    console.log(`Server error ${err}`);
    process.exit(1);
});