import { logger } from "../utils/logger.js";

export const requestLogger = (req, res, next) => {
    const { method, url } = req;
    logger.info(`Incoming Request: ${method} ${url}`);
    next();
};
