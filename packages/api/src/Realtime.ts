import {io, Socket} from "socket.io-client";
import {ClientToServerEvents, ServerToClientEvents} from "typings";

const dateString = () => {
    return (new Date()).toLocaleString();
}

// Establishes and maintains a persistent connection to backend
export default class Realtime {

    private readonly wsBaseUrl: string = '';
    private readonly socket: Socket<ServerToClientEvents, ClientToServerEvents>;

    // state
    protected token: string = "";
    protected room: string = "";

    constructor(wsBaseUrl: string = '') {
        this.wsBaseUrl = wsBaseUrl;

        this.socket = io(this.wsBaseUrl, {
            // when long polling disabled: sticky sessions are not required on the server side
            transports: ['websocket'],
            autoConnect: false,
            timeout: 3000,
            reconnection: true,// TODO: disable by default. make it force connect() manually
            reconnectionAttempts: 99,
            reconnectionDelay: 1000 + Math.floor(1000 * Math.random())
        });

        this.setupListeners();
    }

    protected setupListeners() {

        this.socket.on('connect', () => {
            console.log(`${dateString()} connect: ${this.token}, Room: ${this.room}`);

            this.resumeSession();
        });

        this.socket.on('disconnect', () => {
            console.log(`${dateString()} disconnect`);
        });

        this.socket.on('connect_error', (err: Error) => {
            console.log(`${dateString()} connect_error: ${err.message}`);
        });

        this.socket.onAny((eventName: string, ...args: any[]) => {
            console.debug(`${eventName} --- ${JSON.stringify(args[0])}`);
        });
    }

    protected resumeSession() {

        if (this.token) {
            this.emitLogin(this.token);
        }

        if (this.room) {
            this.emitJoinEvent(this.room);
        }
    }

    // As a general best practice, it is suggested to connect the event listeners before connecting the client, so that no events are lost.
    async connect() {

        // TODO: check if already connected?
        console.log(`Current connection state: ${this.isConnected}`);

        return new Promise((resolve, reject): void => {

            this.socket.once('connect', () => {
                resolve(true);
            });

            this.socket.once('connect_error', () => {
                reject();
            })

            this.socket.connect();

        });
    }

    get isConnected(): boolean {
        return this.socket.connected;
    }

    public once<K extends keyof ServerToClientEvents>(eventName: K, handler: ServerToClientEvents[K]): void {
        this.socket.off(eventName);

        // @ts-ignore
        this.socket.on(eventName, handler);
    }

    onMessage(callback: (message: any) => void) {
        this.once('message', callback);
    }

    // TODO: setAuthToken
    loginUsingToken(token: string) {
        this.token = token;
        this.emitLogin(token);
    }

    private emitLogin(token: string) {

        if (token) {
            this.socket.emit('login', {
                token: token
            });
        }
    }

    // TODO: subscribe
    joinRoom(room: string) {
        this.room = room;
        this.emitJoinEvent(room);
    }

    private emitJoinEvent(room: string) {

        if (room) {
            this.socket.emit('join', {
                uid: room
            });
        }
    }

    sendMessage(text: string) {

        this.socket.emit('sendMessage', {
            timestamp: Date.now(),
            text: text
        })
    }

    public logout(): void {
        this.socket.emit('logout', {reason: "none of your business"});
        this.token = "";
    }

    public disconnect(): void {
        this.socket.disconnect();
    }
}