import {Emitter} from "@socket.io/redis-emitter";
import {User} from "./models/User";
import {RedisManager} from "./services/RedisManager";
import {Room} from "./models/Room";
import {ConnectionRepository} from "./repositories/ConnectionRepository";
import {ServerToClientEvents} from "@athlon1600/chat-typings";
import {messageEntityToEvent, roomEntityToRoom, userEntityToUser} from "./websocket/transformers";
import {ChatMessage} from "./models/ChatMessage";

const redisClient = RedisManager.getClientInstance();
const io = new Emitter<ServerToClientEvents>(redisClient);

export class SocketEventBroadcaster {

    constructor() {
        // do nothing
    }

    protected static emitter() {
        return io;
    }

    public static disconnectBySocketId(socketId: string) {
        io.in([socketId]).disconnectSockets()
    }

    public static emitNewMessage(message: ChatMessage, room: Room) {

        const ev = messageEntityToEvent(message);

        if (room) {
            io.in(room.uid).emit('message', ev);
        }
    }

    public static emitRoomPurged(roomUid: string): void {

        io.in(roomUid).emit("room_purged", {
            deleted: true
        });
    }

    public static emitMessageDeleted(id: number) {
        io.emit('message_deleted', {
            ids: id
        });
    }

    public static emitUserUpdated(user: User): void {

        io.emit('user_updated', {
            user: userEntityToUser(user)
        });
    }

    public static emitRoomUpdated(room: Room): void {

        io.in(room.uid).emit('room_updated', {
            room: roomEntityToRoom(room)
        });
    }

    public static async authUpdated(user: User): Promise<void> {

        const socketIds = await (new ConnectionRepository()).getActiveConnectionsForUser(user);

        io.to(socketIds).emit('auth_updated', {
            user: userEntityToUser(user)
        });

        this.emitUserUpdated(user);
    }
}