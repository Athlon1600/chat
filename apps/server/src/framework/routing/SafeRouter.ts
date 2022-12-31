import {NextFunction, Request, RequestHandler, Response, Router} from "express";

function wrap(func: (req: Request, res: Response, next: NextFunction) => void) {
    return async function (req: Request, res: Response, next: NextFunction) {
        try {
            await func(req, res, next);
        } catch (err) {
            next(err);
        }
    }
}

const safeHandler = function (fn: RequestHandler) {
    return function (req: Request, res: Response, next: NextFunction) {
        return Promise.resolve(fn(req, res, next)).catch(next);
    };
};

type Handler = (req: Request, res: Response) => Promise<any>;

// FailSafeRouter
export class SafeRouter {

    protected readonly expressRouter: Router;

    constructor() {
        this.expressRouter = Router();
    }

    static get safeHandler() {
        return safeHandler;
    }

    get router(): Router {
        return this.expressRouter;
    }

    // TODO: allow unlimited args inside handler?
    public get(path: string, handler: Handler) {
        this.expressRouter.get(path, safeHandler(handler));
    }

    public post(path: string, handler: Handler) {
        this.expressRouter.post(path, safeHandler(handler));
    }

    public patch(path: string, handler: Handler) {
        this.expressRouter.patch(path, safeHandler(handler));
    }

    public delete(path: string, handler: Handler) {
        this.expressRouter.delete(path, safeHandler(handler));
    }
}