import { Request, Response, NextFunction } from "express";
import Logger from "./errorlogger";

const logger = Logger.getInstance();

export const globalErrorHandler = (err: any, res: Response) => {
    const statusCode = err.statusCode || 500;
    if (statusCode === 500) {
        logger.logError(`${!err.statusCode ? 'Spotted Without Status Code ' : ' '}${err}`);
    }
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({ error: message });
};