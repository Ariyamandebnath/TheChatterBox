import dotenv from "dotenv";
import connectDB from "./db/index";
import { httpServer } from "./app";
import * as http from "http";

dotenv.config({
    path: './.env',
});

connectDB()
    .then(() => {
        httpServer.listen(process.env.PORT || 3000, () => {
            console.log(`Server is running at : ${process.env.PORT}`);
        });
        httpServer.on("error", (err: NodeJS.ErrnoException) => { // Assuming httpServer is of type http.Server
            console.error("Server error: ", err);
        });
    })
    .catch((err: Error) => {
        console.error(`MongoDB connection failed: ${err.message}`);
    });
