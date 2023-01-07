import * as http from "http";
import {Server, ServerOptions, Socket} from "socket.io";
import {SocketSession} from "./SocketSession";
import {SessionService} from "../services/SessionService";
import {onDisconnect} from "./listeners/OnDisconnect";
import {onConnect} from "./listeners/OnConnect";
import {SocketServerRedis} from "./SocketServerRedis";
import {socketListeners} from "./listeners";
import {SocketEventHandler} from "../types";

export class ChatServer {

    private readonly httpServer: http.Server;
    // TODO: <listenEvents, emitEvents>
    private readonly socketServer: Server;

    // TODO: need logger
    constructor(httpServer: http.Server) {
        this.httpServer = httpServer;

        const customOptions: Partial<ServerOptions> = {
            // https://stackoverflow.com/questions/12977719/how-much-data-can-i-send-through-a-socket-emit#comment17606663_12978658
            maxHttpBufferSize: 1e4,

            // Force Socket.io to ONLY use "websockets"; No Long Polling.
            transports: ['websocket'],
            serveClient: false,
            cors: {
                origin: '*'
            }
        }

        const superServer = new SocketServerRedis(this.httpServer, customOptions);
        this.socketServer = superServer.server;

        this.boot();
        this.registerListeners();
    }

    protected boot() {
        // TODO
    }

    protected async shouldAccept(socket: Socket): Promise<boolean> {

        // TODO: rate limit this too:
        // https://github.com/animir/node-rate-limiter-flexible/wiki/Overall-example#websocket-single-connection-prevent-flooding
        // TODO: if current connection > max connections disconnect old connections or reject this one
        return true;
    }

    protected registerListeners() {

        // otherwise you toPoolConfig: throw er; // Unhandled 'error' event
        this.httpServer.on('connection', (socket: Socket) => {

            socket.on('error', function (err) {
                console.log(err);
            });
        });

        this.socketServer.on('connection', async (socket: Socket) => {

            if (await this.shouldAccept(socket)) {
                console.log('Connection accepted from: ' + socket.id);
            }

            // TODO: verify if token == XXX
            // console.log(socket.handshake.query);

            socket.on("connect_error", (err) => {
                console.log(`connect_error due to ${err.message}`);
            });

            // TODO: make sure ConnectionSessionEntity has already been created by now
            this.afterConnectionEstablished(socket);

        });
    }

    protected afterConnectionEstablished(socket: Socket) {

        // TODO: socketId should be a float rather than string to save space
        // TODO: wait until persist...  but this will prevent listener
        SessionService.createFromSocket(socket).then();

        const connection = new SocketSession(socket);

        // Invoked after WebSocket negotiation has succeeded and the WebSocket connection is opened and ready for use.
        onConnect(connection).then().catch();

        // TODO: just add them here one by one

        // messages that will be sent by the Client
        socketListeners.forEach((handler: SocketEventHandler, eventName: string) => {
            socket.on(eventName, (payload: any) => {

                handler(connection, payload).then();

            });
        });

        // only gets called when browser refresh page, etc... not when app restarts
        socket.on('disconnect', () => {
            onDisconnect(connection).then();
        });

        this.pong(socket);
    }

    // https://github.com/websockets/ws#how-to-detect-and-close-broken-connections
    // https://hackernoon.com/enforcing-a-single-web-socket-connection-per-user-with-node-js-socket-io-and-redis-65f9eb57f66a
    protected pong(socket: Socket) {

        // TODO: onConnectionPacket.ts
        socket.conn.on('packet', async (packet: any) => {

            // server sends ping, client must send back pong
            // The server sends a ping, and if the client does not answer with a pong within pingTimeout ms,
            // the server considers that the connection is closed.
            if (packet.type === 'pong') {
                await SessionService.ping(socket);
            }

        });
    }

    protected handleTransportError() {
        console.log('IO: Error');
    }

    public start(port: number) {
        this.httpServer.listen(port);
        console.log(`---- server started. listen : ${port} ----`);
    }

    public async stop() {

        return new Promise((resolve) => {

            this.socketServer.close(() => {
                resolve(1);
            });

        });
    }
}