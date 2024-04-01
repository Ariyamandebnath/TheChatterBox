import mongoose from "mongoose";
import logger from "../logger/winston.logger"
import { ApiError } from "utils/ApiError";
import { asyncHandler } from "utils/asyncHandler";
import { Request } from 'express';
import express from 'express';


//This middleware will catch the errors from any request handeler wrapped instide asyncHandler

const errorHandler = (err: ApiError|Error, req: express.Request, res: express.Response, next:express.NextFunction) => {
    let error = err;

    //Check ;if the error is an instance of an ApiError class which extends native Error class
    if (!(error instanceof ApiError)) {

        const statusCode = error.statusCode || error instanceof mongoose.Error ? 400 : 500;

        const message = error.message || "Something went wrong";
        error = new ApiError(statusCode, message, error?.errors || [], err.stack);
    }


// Now we are sure that the `error` variable will be an instance of ApiError class
const response = {
    ...error,
    message: error.message,
    ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {}),
    // Error stack traces should be visible in development for debugging
  };

  logger.error(`${error.message}`);

  // Send error response
  return res.status(error.statusCode).json(response);
};

export { errorHandler };