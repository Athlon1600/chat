import {NextFunction, Request, Response} from "express";

export const RequiresAuthenticationMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    if (req.user) {
        next();
        return;
    }

    next(new Error("401 Unauthorized"));
}