import {Nullable, NullablePromise, UserOrNull} from "../types";
import {RedisManager} from "./RedisManager";
import {UserRepository} from "../repositories/UserRepository";
import {User} from "../models/User";
import {RoomRepository} from "../repositories/RoomRepository";
import {Room} from "../models/Room";
import {StringUtils} from "../util/StringUtils";
import {DateUtils} from "../util/DateUtils";

export class CacheService {

    // TODO: cache raw queries themselves
    static async getUserByUid(uid: string): Promise<UserOrNull> {

        const cacheKey = `users:${uid}`;

        return RedisManager.getObjectOrSet<Nullable<User>>(cacheKey, async () => {

            const userFromDatabase = await (new UserRepository()).findByUid(uid);
            return userFromDatabase ? userFromDatabase : null;
        });
    }

    static async invalidateUserCacheByUid(uid: string): Promise<number> {
        return RedisManager.getClientInstance().del(`users:${uid}`);
    }

    static async getRoomByUid(uid: string): NullablePromise<Room> {

        return RedisManager.getObjectOrSet<Nullable<Room>>("room_" + uid, async () => {

            const room = await (new RoomRepository()).findByUid(uid);
            return room ? room : null;

        }, 60 * 60);
    }

    protected static getMessageLastSentCacheKey(room: number, user: number): string {
        return `message_last_sent:${room}:${user}`;
    }

    static async updateMessageLastSent(room: number, user: number): Promise<number> {

        const lastSent = DateUtils.timestampInSeconds();

        await RedisManager.getClientInstance().set(this.getMessageLastSentCacheKey(room, user), lastSent);
        return lastSent;
    }

    static async getMessageLastSent(room: number, userId: number): NullablePromise<number> {

        const cacheKey = this.getMessageLastSentCacheKey(room, userId);
        const result = await RedisManager.getClientInstance().get(cacheKey);

        return result ? StringUtils.parseIntOrDefault(result) : null;
    }
}