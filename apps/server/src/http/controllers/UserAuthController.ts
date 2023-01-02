import {Request, Response} from "express";
import {UserService} from "../../services/UserService";
import {validatePassword, validateUsername} from "../../validators";
import {UserResource} from "../../resources/UserResource";
import {UserRepository} from "../../repositories/UserRepository";
import UnauthorizedException from "../../exceptions/UnauthorizedException";

export class UserAuthController {

    // TODO: rate limit 1 reg per 2 seconds
    // TODO: first user to signup = root user?
    static async register(req: Request, res: Response) {

        const data = req.body as { username: string, password: string };

        // TODO: refactor into its own needsToCreateRootUser method
        const count = await (new UserRepository()).getActiveUserCount();

        if (count === 0) {

            if (data.username !== 'root' || !data.password) {
                throw new UnauthorizedException("Cannot create new users until ROOT user has been created first");
            }
        }

        if (!data.username || !validateUsername(data.username)) {

            return res.json({
                error: 'Invalid username'
            });

        } else if (!data.password || !validatePassword(data.password)) {

            return res.json({
                error: 'Invalid password'
            });
        }

        const user = await UserService.createUserWithPassword(data.username, data.password);

        if (user) {
            return res.json({
                user: UserResource.make(user).toArray(),
                token: user.auth_token
            });
        }

        throw new Error("Failed to create user");
    }

    static async login(req: Request, res: Response) {

        const username = req.body['username'] as string;
        const password = req.body['password'] as string;

        const reuse = req.query['reuse'];
        const guest = !!(req.body['guest'] as string);

        if (username && password) {

            const user = await UserService.findByCredentials(username, password);

            if (user) {
                return res.json({
                    user: UserResource.make(user).toArray(),
                    token: user.auth_token
                });

            } else {

                return res.json({
                    error: 'Invalid credentials'
                });
            }

        } else if (guest) {

            const guestUser = await UserService.findOrCreateByIp(req.ip);

            if (guestUser) {

                const ip = req.ip;

                // update country
                const location = await UserService.updateLastConnectionInfo(guestUser, ip);
                guestUser.country_code = location?.countryCode || "";

                return res.json({
                    user: UserResource.make(guestUser).toArray(),
                    token: guestUser.auth_token
                });
            }
        }

        return res.json({
            error: 'Failed to login'
        });
    }
}