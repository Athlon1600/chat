import {User} from "../models/User";
import {UserRepository} from "../repositories/UserRepository";
import {SocketEventBroadcaster} from "../SocketEventBroadcaster";
import {ConnectionRepository} from "../repositories/ConnectionRepository";
import {CacheService} from "./CacheService";
import {DateUtils} from "../util/DateUtils";
import {GeoIPResponse, NullablePromise, UserOrNull} from "../types";
import {InternetUtils} from "../util/InternetUtils";
import {SecurityUtils} from "../util/SecurityUtils";
import {SocketConnectionEntity} from "../models/SocketConnectionEntity";
import UnauthorizedException from "../exceptions/UnauthorizedException";
import {Room} from "../models/Room";
import {ModerationService} from "./ModerationService";
import {USER_ROLE} from "@athlon1600/chat-typings";

const usersRepo = new UserRepository();
const connections = new ConnectionRepository();

export class UserService {

    static readonly NAME_CHANGE_INTERVAL = DateUtils.SECONDS_IN_DAY;

    static readonly RESERVED_USERNAMES: Array<string> = [
        'root',
        'superuser',
        'admin',
        'administrator',
        'owner'
    ];

    // "root" user has all the possible permissions, and can never be banned or deleted by anyone else
    static isRootUser(user: User): boolean {
        return user.id === 1;
    }

    static async getUserRoles(user: User, room: Room): Promise<USER_ROLE[]> {

        const roles: USER_ROLE[] = [];

        if (this.isRootUser(user)) {
            roles.push("root");
        }

        if (user.is_admin) {
            roles.push("admin");
        }

        if (user.is_super_mod) {
            roles.push("super_mod");
        } else {

            const moderator = await ModerationService.getUserRoomModStatus(user, room);

            if (moderator) {
                roles.push("mod");
            }
        }

        if (room.user_id === user.id) {
            roles.push("owner");
        }

        if (user.username) {
            roles.push("registered")
        } else {
            roles.push("guest");
        }

        return roles;
    }

    static canModifyUser(who: User, target: User): boolean {

        if (who && target) {
            return this.isRootUser(who) || who.uid === target.uid;
        }

        return false;
    }

    static canChangeDisplayName(user: User): boolean {

        const dateString: string = user.display_name_updated_at;

        if (dateString) {
            const seconds = DateUtils.getSecondsSince(dateString);
            return seconds >= this.NAME_CHANGE_INTERVAL;
        }

        return false;
    }

    static async getLastUsedIpAddress(user: User): NullablePromise<string> {

        const userConnections = await connections.getConnectionsByUser(user);

        // why would any connection not have IP?
        const firstWithIp = userConnections.find((connection: SocketConnectionEntity) => {
            return connection.ip_addr !== "";
        });

        return firstWithIp ? firstWithIp.ip_addr : null;
    }

    static async findAll(): Promise<User[]> {
        return usersRepo.findAll();
    }

    static async findByUid(uid: string): NullablePromise<User> {
        return usersRepo.findByUid(uid);
    }

    static async findByUidOrFail(uid: string): Promise<User> {

        const user = await this.findByUid(uid);

        if (!user) {
            throw new Error(`User: ${uid} not found!`);
        }

        return user;
    }

    static async findUniqueByPartialName(name: string): NullablePromise<User> {

        if (name.length < 3) {
            return null;
        }

        const temp = await usersRepo.findFirstByNamePartial(name);

        if (temp.length === 1) {
            return temp[0];
        }

        return null;
    }

    static async findOrCreateByIp(ip: string): NullablePromise<User> {

        const existing = await usersRepo.findGuestUserByIp(ip);

        if (existing) {
            return existing;
        }

        return usersRepo.createGuestUser(ip);
    }

    static async updateDisplayName(user: User, newDisplayName: string, admin?: User) {

        if (admin) {

            if (!this.canModifyUser(admin, user)) {
                throw new UnauthorizedException()
            }
        }

        if (!this.canChangeDisplayName(user)) {
            //  throw new UnauthorizedException("Cannot change name just yet");
        }

        await usersRepo.updateDisplayName(user, newDisplayName);
        await CacheService.invalidateUserCacheByUid(user.uid);

        const updatedUser = await usersRepo.findByUid(user.uid);

        if (updatedUser) {
            await SocketEventBroadcaster.authUpdated(updatedUser);
        }
    }

    static async updateUserInfo(user: User, values: Partial<User>): Promise<void> {

        if (user.uid) {

            if (values.display_name) {
                values.display_name_updated_at = DateUtils.getTimeStringForMySQL();
            }

            await usersRepo.update(user.uid, values);

            CacheService.invalidateUserCacheByUid(user.uid).then();

            const updatedUser = await usersRepo.findByUid(user.uid);

            if (updatedUser) {
                await SocketEventBroadcaster.authUpdated(updatedUser);
            }
        }
    }

    static async updateLastConnectionInfo(user: User, ipAddress: string): NullablePromise<GeoIPResponse> {

        const location = await InternetUtils.getIpLocation(ipAddress);

        let countryCode = (location && location.countryCode) ? location.countryCode : "";

        await this.updateUserInfo(user, {
            ip_address: ipAddress,
            country_code: countryCode
        });

        return location;
    }

    static async getOpenConnections(user: User): Promise<string[]> {
        return connections.getActiveConnectionsForUser(user);
    }

    static async createUserWithPassword(username: string, password: string): Promise<UserOrNull> {

        const existingUser = await usersRepo.findByUsername(username);

        if (existingUser) {
            throw "User with such username already exists!";
        }

        return usersRepo.createUserWithPassword(username, password);
    }

    static async findByCredentials(username: string, password: string): Promise<UserOrNull> {

        const data = await usersRepo.getPasswordFromUsername(username);

        // otherwise: throw new Error('data and hash arguments required');
        if (data && data.password && password) {
            const valid = await SecurityUtils.passwordVerify(password, data.password);

            if (valid) {
                return (new UserRepository()).findById(data.id);
            }
        }

        return null;
    }

    static async delete(user: User, admin?: User): Promise<void> {
        if (user.uid) {
            await usersRepo.deleteByUid(user.uid);
        }
    }
}