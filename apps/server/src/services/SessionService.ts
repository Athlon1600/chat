import {ConnectionRepository} from "../repositories/ConnectionRepository";
import {User} from "../models/User";
import {Socket} from "socket.io";
import {Lottery} from "../framework/Lottery";
import {SocketConnectionEntity} from "../models/SocketConnectionEntity";
import {Room} from "../models/Room";

const connectionsRepo = new ConnectionRepository();

export class SessionService {

    protected static pruneLottery = new Lottery(1, 10);

    public static async createFromSocket(socket: Socket): Promise<void> {
        await connectionsRepo.create(socket);
    }

    public static async ping(socket: Socket): Promise<void> {
        await connectionsRepo.ping(socket.id);
    }

    public static async loginUser(socketId: string, user: User) {
        // @ts-ignore
        await connectionsRepo.updateCurrentAuthUser(socketId, user.id);
    }

    public static async logoutUser(socketId: string) {
        await connectionsRepo.logout(socketId);
    }

    public static async setCurrentRoom(socketId: string, room: Room): Promise<void> {
        await connectionsRepo.updateCurrentRoom(socketId, room.uid);
    }

    public static async leaveRoom(socketId: string): Promise<void> {
        await connectionsRepo.leaveRoom(socketId);
    }

    // setDisconnectionCause(reason = "")
    public static async disconnect(socketId: string): Promise<void> {

        await connectionsRepo.disconnected(socketId).catch((err) => {
            // do nothing
        });
    }

    public static async getAllActiveConnections(): Promise<SocketConnectionEntity[]> {

        if (this.pruneLottery.draw()) {
            await connectionsRepo.purgeHangingConnections();
        }

        return connectionsRepo.getAllConnections();
    }

    public static async pruneInactive(): Promise<void> {
        await connectionsRepo.purgeHangingConnections();

        // TODO: loop through each socket and send disconnect too
    }
}