import express from "express";
import { Server, createServer } from "http";

const app = express()


const httpServer: Server = createServer(app);




export { httpServer };