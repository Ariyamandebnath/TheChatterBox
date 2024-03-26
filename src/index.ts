import dotenv from "dotenv";
import connectDB from "./db/index";
import { httpServer } from "./app";
import * as http from "http";

dotenv.config({
    path: './.env',
});


const startServer = () => {
    httpServer.listen(process.env.PORT || 3000, () => {
        console.info(
            ` Visit documentation at : http://localhost:${process.env.PORT || 3000
            }`
        );
        console.log("⚙️  Server is running on port: " + process.env.PORT);
    });
};

const start = async () => {
    try {
        await connectDB();
        startServer();
    } catch (err) {
        console.log("Mongo db connect error: ", err)
    }
};

start();