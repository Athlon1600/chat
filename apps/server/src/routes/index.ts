import {users} from "./users";
import {rooms} from "./rooms";
import {messages} from "./messages";
import {Request, Response, Router} from "express";
import {connections} from "./connections";
import {ConfigController} from "../http/controllers/ConfigController";
import {RequiresAuthenticationMiddleware} from "../http/RequiresAuthenticationMiddleware";
import {BanController} from "../http/controllers/BanController";
import {HomeController} from "../http/controllers/HomeController";
import {UserController} from "../http/controllers/UserController";
import {SafeRouter} from "../framework/routing/SafeRouter";
import {WebsocketController} from "../http/controllers/WebsocketController";

const rootRouter = Router();
const safeRouter = new SafeRouter();

rootRouter.get('/', HomeController.index);
rootRouter.get('/health', HomeController.health);
rootRouter.get('/random', HomeController.random);
rootRouter.get('/geoip2', HomeController.geoip2);

safeRouter.get('/websocket', WebsocketController.open);

rootRouter.use('/connections', connections);
rootRouter.use('/users', users);

// alias
safeRouter.get('/me', UserController.read);
safeRouter.patch('/me', UserController.update);

rootRouter.use('/rooms', rooms);
rootRouter.use('/messages', messages);

const banRouter = Router();
banRouter.get('/bans', RequiresAuthenticationMiddleware, BanController.index);
banRouter.post('/bans', RequiresAuthenticationMiddleware, SafeRouter.safeHandler(BanController.create));
banRouter.post('/unban', RequiresAuthenticationMiddleware, SafeRouter.safeHandler(BanController.unban));

rootRouter.use('/', banRouter);

rootRouter.get('/moderators', (req: Request, res: Response) => {

    res.json({
        message: 'Nothing to see here yet'
    })
});

rootRouter.use('/', safeRouter.router);

export const routes = rootRouter;
