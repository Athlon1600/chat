import {NextFunction, Request, Response} from "express";
import {UserRepository} from "../repositories/UserRepository";
import {SafeQuery} from "../util/SafeQuery";

async function handler(req: Request, res: Response, next: NextFunction): Promise<void> {

    // do something here with either `req` or `res` or both!
    const authorization = req.header('Authorization') || "";
    let token = authorization.startsWith('Bearer ') ? authorization.substr(7) : null;

    // access_token
    if (req.query['token']) {
        token = SafeQuery.parse(req.query).getString('token');
    }

    req.bearerToken = token;
    req.user = null;
    req.admin = false;

    if (token) {

        try {
            const userFound = await UserRepository.findByAuthToken(token);
            req.user = userFound;
            req.admin = !!(userFound && (userFound.id === 1 || userFound.username === 'admin'));

        } catch (ex) {
            // fail silently
        }
    }

    next()
}

export const AuthorizationMiddleware = handler;
