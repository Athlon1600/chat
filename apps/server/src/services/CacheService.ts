import {Nullable, NullablePromise, UserOrNull} from "../types";
import {RedisManager} from "./RedisManager";
import {UserRepository} from "../repositories/UserRepository";
import {User} from "../models/User";
import {RoomRepository} from "../repositories/RoomRepository";
import {Room} from "../models/Room";
import {StringUtils} from "../util/StringUtils";
import {DateUtils} from "../util/DateUtils";
import {UserService} from "./UserService";

export class CacheService {

    static async getUserByUid(uid: string, roomContext?: Room): Promise<UserOrNull> {

        const cacheKey = `users:${uid}`; // TODO: :roomContext.id

        return RedisManager.getObjectOrSet<Nullable<User>>(cacheKey, async () => {

            const userEntity = await (new UserRepository()).findByUid(uid);

            if (userEntity) {

                if (roomContext) {
                    userEntity.roles = await UserService.loadRolesFor(userEntity, roomContext);
                }

                return userEntity;
            }

            return null;
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

    static async getRoomModerators(room: number) {
        return null;
    }

    static async revokeModeratorCache() {

    }
}