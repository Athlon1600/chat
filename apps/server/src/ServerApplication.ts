import {EventEmitter} from 'node:events';
import {Application, NextFunction, Request, Response} from "express";
import bodyParser from "body-parser";
import cors from "cors";
import {AuthorizationMiddleware} from "./http/AuthorizationMiddleware";
import path from "path";
import {ChatServer} from "./websocket/ChatServer";
import {registerShutdownCallback} from "./registerShutdownCallback";
import {routes} from "./routes";
import NotFoundException from "./exceptions/NotFoundException";
import UnauthorizedException from "./exceptions/UnauthorizedException";

const express = require('express');
const http = require('http');

export class ServerApplication {

    public static readonly myEmitter: EventEmitter = new EventEmitter();

    public static readonly PORT_DEFAULT: number = 3000;

    protected app: Application;
    protected httpServer;

    // protected router: Router;

    constructor() {

        let app = express();
        this.httpServer = http.createServer(app);
        this.app = app;

        app.set('etag', false);
        app.disable('x-powered-by');

        app.set('trust proxy', true);
        app.set('json spaces', 2);

        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(cors());

        this.initMiddleware();
        this.installFaviconHandler();
        this.loadRoutes();
        this.bootStatic();
        this.bootErrorHandler();
        this.bootNotFoundHandler();
        this.initWebSocket();
    }

    protected initMiddleware() {
        this.app.use(AuthorizationMiddleware);
    }

    protected loadRoutes() {
        const app = this.app;
        app.use('/', routes);
    }

    protected installFaviconHandler() {
        this.app.get('/favicon.ico', function (req: Request, res: Response) {
            return res.status(204).end();
        });
    }

    protected bootStatic() {

        let p = path.join(__dirname, '../public');

        // app.use('/static', express.static('public'));
        this.app.use(express.static(p, {
            etag: false
        }));
    }

    protected bootErrorHandler() {

        // only handles non-async so far: https://github.com/davidbanham/express-async-errors
        this.app.use((error: Error, req: Request, res: Response, next: any) => {

            if (error instanceof NotFoundException) {

                return res.status(404).json({
                    error: error.message
                });

            } else if (error instanceof UnauthorizedException) {

                return res.status(401).json({
                    error: error.message
                });
            }

            res.setHeader('Access-Control-Allow-Origin', '*');

            // you can also throw "string"
            return res.status(500).json({
                error: error.message ?? error,
                stack: error.stack ?? null
            });
        });
    }

    protected bootNotFoundHandler() {
        this.app.get('*', function (req: Request, res: Response, next: NextFunction) {

            const path = req.path;

            res.status(404).json({
                error: `Endpoint ${path} not found`
            });
        });
    }

    protected initWebSocket() {

        const webSocketServer = new ChatServer(this.httpServer);

        registerShutdownCallback(async (signal) => {

            console.debug(`Received Signal: ${signal}`);
            await webSocketServer.stop();

        });
    }

    async start(port: number) {

        const httpServer = this.httpServer;

        httpServer.listen(port, function () {

            let host = httpServer.address().address;
            let port = httpServer.address().port;

            console.log('App listening at http://%s:%s', host, port);

        });
    }

    async startInClusterMode() {
        // TODO
    }
}