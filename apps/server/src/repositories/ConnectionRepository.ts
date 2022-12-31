import {AbstractRepository} from "./AbstractRepository";
import {SocketConnectionEntity} from "../models/SocketConnectionEntity";
import {Socket} from "socket.io";
import {CacheService} from "../services/CacheService";
import {MapOfNumberSetsWithNumberKeys, ObjectWithStringKeys} from "../types";
import {User} from "../models/User";
import {UserRepository} from "./UserRepository";
import {ArrayUtils} from "../framework/util/ArrayUtils";
import {RoomRepository} from "./RoomRepository";

const userRepository = new UserRepository();
const roomRepository = new RoomRepository();

export class ConnectionRepository extends AbstractRepository<SocketConnectionEntity> {

    async create(socket: Socket): Promise<boolean> {

        const userAgent = ""; //(socket.request.headers["user-agent"] || "").substr(0, 255);

        let result = await this.database.query(
            `INSERT INTO connections
                 (created_at, updated_at, socket_id, ip_address, user_agent)
             VALUES (UTC_TIMESTAMP(), UTC_TIMESTAMP(), ?, ?, ?)`, [socket.id, socket.handshake.address, userAgent]
        );

        return result.success();
    }

    async ping(socketId: string): Promise<void> {
        await this.database.query(
            `UPDATE connections
             SET updated_at = UTC_TIMESTAMP()
             WHERE socket_id = ?`, [socketId]);
    }

    async updateCurrentRoom(socketId: string, room: string): Promise<void> {

        const temp = await CacheService.getRoomByUid(room);

        if (temp) {

            await this.database.query(`
                UPDATE connections
                SET room_id = ?
                WHERE socket_id = ?`, [temp.id, socketId]);
        }
    }

    async leaveRoom(socketId: string): Promise<void> {
        await this.database.query(`
            UPDATE connections
            SET room_id = NULL
            WHERE socket_id = ?`, [socketId]);
    }

    async updateCurrentAuthUser(socketId: string, userId: number) {
        await this.database.query(
            `UPDATE connections
             SET user_id = ?
             WHERE socket_id = ?`, [userId, socketId]);
    }

    async logout(socketId: string): Promise<boolean> {

        const result = await this.database.query(`
            UPDATE connections
            SET user_id = NULL
            WHERE socket_id = ?
        `, [socketId]);

        return result.success();
    }

    async getAllConnections(): Promise<SocketConnectionEntity[]> {

        const result = await this.database.query(
            `SELECT *
             FROM connections
             WHERE updated_at >= DATE_SUB(UTC_TIMESTAMP(), INTERVAL 10 MINUTE)
               AND deleted_at IS NULL`, []);

        const sessions = result.getRowsAsModels(SocketConnectionEntity);

        const userIds: Array<number> = sessions.map((connection: SocketConnectionEntity) => {
            return connection.user_id;
        });

        const users = await userRepository.findManyById(userIds);

        const idUsers = ArrayUtils.keyBy(users, 'id');

        sessions.forEach((value: SocketConnectionEntity) => {

            if (value.user_id && idUsers.has(value.user_id.toString())) {
                value.user = idUsers.get(value.user_id.toString());
            }
        });

        const roomIds: Array<number> = sessions.map((connection: SocketConnectionEntity) => {
            return connection.channel_id;
        });

        const rooms = await roomRepository.findMany(roomIds);
        const idRooms = ArrayUtils.keyBy(rooms, 'id');

        sessions.forEach((value: SocketConnectionEntity) => {

            if (value.channel_id && idRooms.has(value.channel_id.toString())) {
                value.room = idRooms.get(value.channel_id.toString());
            }
        })

        return sessions;
    }

    // list of all connected clients + room + their auth state in efficient data-type
    async getRoomsWithUsers(): Promise<MapOfNumberSetsWithNumberKeys> {

        const result = await this.database.query(
            `SELECT user_id, room_id
             FROM connections
             WHERE updated_at >= DATE_SUB(UTC_TIMESTAMP(), INTERVAL 5 MINUTE)
               AND deleted_at IS NULL`, []);

        const connections = result.getRowsAsModels(SocketConnectionEntity);

        const map = new Map() as MapOfNumberSetsWithNumberKeys;

        connections.forEach((session) => {

            if (session.user_id && session.channel_id) {

                if (!map.has(session.channel_id)) {
                    map.set(session.channel_id, new Set());
                }

                const temp = map.get(session.channel_id);

                if (temp) {
                    temp.add(session.user_id);
                }
            }
        });

        return map;
    }

    async getActiveConnectionsForUser(user: User): Promise<string[]> {

        // TODO: ignore without last check in last 15 minutes
        const result = await this.database.query(
            `SELECT socket_id
             FROM connections
             WHERE user_id = ?
               AND deleted_at IS NULL
               AND updated_at > DATE_SUB(UTC_TIMESTAMP(), INTERVAL 10 MINUTE)`, [user.id]
        );

        return result.getRows().map((value) => {
            return (value as ObjectWithStringKeys)['socket_id'];
        })
    }

    async getConnectionsByUser(user: User, limit: number = 10): Promise<SocketConnectionEntity[]> {

        const result = await this.database.query(
            `SELECT *
             FROM connections
             WHERE user_id = ?
             ORDER BY id DESC
             LIMIT 10`, [user.id]
        );

        return result.getRowsAsModels(SocketConnectionEntity);
    }

    // 1 minute MAX
    async purgeHangingConnections(olderThanMinutes: number = 10): Promise<boolean> {

        const result = await this.database.query(
            `DELETE
             FROM connections
             WHERE deleted_at IS NULL
               AND (updated_at < DATE_SUB(UTC_TIMESTAMP(), INTERVAL 10 MINUTE) OR updated_at IS NULL)`, []
        );

        return result.success();
    }

    async disconnected(socketId: string): Promise<void> {
        await this.database.query(
            `UPDATE connections
             SET deleted_at = UTC_TIMESTAMP()
             WHERE socket_id = ?`, [socketId]);
    }
}