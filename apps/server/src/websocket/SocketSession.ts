import {Socket} from "socket.io";
import {NullablePromise, UserOrNull} from "../types";
import {Room} from "../models/Room";
import {CacheService} from "../services/CacheService";
import {User} from "../models/User";
import {SessionService} from "../services/SessionService";
import {SocketEventBroadcaster} from "../SocketEventBroadcaster";
import {UserService} from "../services/UserService";

export class SocketSession {

    // The underlying socket. SHOULD NEVER HAVE TO USE DIRECTLY!
    public readonly socket: Socket;

    // Disconnect if not authenticated within 30 seconds
    // protected disconnectTimer: NodeJS.Timer;

    // Store only references - if we store complete objects, those become outdated
    protected user: string = "";
    protected room: string = "";

    protected sessionData: Map<String, String> = new Map<String, String>();

    constructor(socket: Socket) {
        this.socket = socket;
    }

    // Returns a string containing the unique identifier assigned to this session.
    public getConnectionId(): string {
        return this.socket.id;
    }

    // store custom session data
    // Return the map with attributes associated with the WebSocket session.
    public getAttributes(): Map<String, String> {
        return this.sessionData;
    }

    // Return the address of the remote client.
    public getRemoteAddress(): string {
        return this.socket.handshake.address;
    }

    public async setUser(user: User): Promise<boolean> {
        this.user = user.uid;

        await SessionService.loginUser(this.getConnectionId(), user);
        const ip = this.getRemoteAddress();

        await UserService.updateLastConnectionInfo(user, ip);

        if (user) {
            await SocketEventBroadcaster.authUpdated(user);
        }

        return true;
    }

    public async logout(): Promise<boolean> {
        this.user = "";

        await SessionService.logoutUser(this.getConnectionId());

        return true;
    }

    async getUser(): Promise<UserOrNull> {

        if (this.user) {
            let temp = await CacheService.getUserByUid(this.user);

            if (temp) {
                return User.createFrom(temp);
            }
        }

        return null;
    }

    async getCurrentRoom(): NullablePromise<Room> {

        if (this.room) {
            return CacheService.getRoomByUid(this.room);
        }

        return null;
    }

    public async joinRoom(room: Room): Promise<boolean> {

        this.socket.join(room.uid);
        this.room = room.uid;

        // TODO: notify users in this room that new user has joined
        await SessionService.setCurrentRoom(this.getConnectionId(), room);

        return false;
    }

    public async leaveRoom(): Promise<boolean> {

        this.socket.leave(this.room);
        this.room = "";

        await SessionService.leaveRoom(this.getConnectionId());

        return false;
    }

    sendServerMessage(data: string) {

        this.socket.emit('server_message', {
            timestamp: Date.now(),
            type: "server",
            text: data
        });
    }

    sendError(err: string): void {

        this.socket.emit('error', {
            timestamp: Date.now(),
            text: err
        });
    }

    disconnect(): void {
        this.socket.disconnect(true);
    }
}