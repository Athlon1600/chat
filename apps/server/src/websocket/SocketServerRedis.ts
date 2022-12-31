import {Server, ServerOptions} from "socket.io";
import {RedisManager} from "../services/RedisManager";
import {instrument} from "@socket.io/admin-ui";
import http from "http";
import {createAdapter} from "@socket.io/redis-adapter";

export class SocketServerRedis {

    // TODO: rename to SocketIOServer
    protected socketServer: Server;

    // TODO: no server options... replace with argument for Redis
    constructor(httpServer: http.Server, socketServerOptions: Partial<ServerOptions>) {

        let server = new Server(httpServer, socketServerOptions);

        // Websocket servers communicate with each other via a PubSub server.
        // Many sockets - one central store!
        const pubClient = RedisManager.getClientInstance();
        const subClient = pubClient.duplicate();

        server.adapter(createAdapter(pubClient, subClient));

        // TODO: only if dev mode?
        instrument(server, {
            auth: false
        });

        this.socketServer = server;
    }

    public get server(): Server {
        return this.socketServer;
    }
}