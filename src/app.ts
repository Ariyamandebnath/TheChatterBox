import express from "express";
import { Server, createServer } from "http";

const app = express()


const httpServer: Server = createServer(app);


//App router
import userRouter from "./routes/auth/user.routes"

export { httpServer };