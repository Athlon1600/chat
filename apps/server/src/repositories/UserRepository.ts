import {AbstractRepository} from "./AbstractRepository";
import {User} from "../models/User";
import _ from "lodash";
import {StringUtils} from "../util/StringUtils";
import {NullablePromise, UserOrNull} from "../types";
import {SecurityUtils} from "../util/SecurityUtils";
import {Room} from "../models/Room";
import {ChatMessageRepository} from "./ChatMessageRepository";

export class UserRepository extends AbstractRepository<User> {

    async getActiveUserCount(): Promise<number> {

        const result = await this.database.query(
            `SELECT COUNT(1) AS cnt
             FROM users
             WHERE deleted_at IS NULL`, []
        );

        return result.getFirstRowValue("cnt");
    }

    async findAll(limit: number = 25): Promise<User[]> {

        const result = await this.database.query(
            `SELECT *
             FROM users
             WHERE deleted_at IS NULL
             ORDER BY id
             LIMIT ?`, [limit]
        );

        return result.getRowsAsModels(User);
    }

    async createGuestUser(userIp: string = "", name: string = ""): Promise<UserOrNull> {

        const uid = StringUtils.random(10);
        const token = await SecurityUtils.newAccessToken(32);

        const displayName = name || `Guest (${uid})`;

        let result = await this.database.query(
            `INSERT INTO users (created_at, uid, is_guest, ip_address, display_name, auth_token)
             VALUES (UTC_TIMESTAMP(), ?, ?, ?, ?, ?)`, [uid, 1, userIp, displayName, token]
        );

        const id = result.getInsertId();

        return id ? this.findById(id) : null;
    }

    async createUserWithPassword(username: string, password: string): Promise<UserOrNull> {

        const uid = StringUtils.random(10);
        const token = await SecurityUtils.newAccessToken(32);

        const hashedPassword = await SecurityUtils.passwordHash(password);
        const displayName = `${username} (${uid})`;

        const result = await this.database.query(
            `INSERT INTO users (created_at, uid, is_guest, username, display_name, password, auth_token)
             VALUES (UTC_TIMESTAMP(), ?, 0, ?, ?, ?, ?)`, [uid, username, displayName, hashedPassword, token]
        );

        if (result.error) {
            throw new Error(result.error);
        }

        const id = result.getInsertId();

        return id ? this.findById(id) : null;
    }

    async getPasswordFromUsername(username: string): NullablePromise<{ id: number, password: string }> {

        const result = await this.database.query(
            `SELECT id, password
             FROM users
             WHERE username = ?
             LIMIT 1`, [username]
        );

        if (result.hasRows()) {
            return result.getRows()[0] as { id: number, password: string };
        }

        return null;
    }

    async findGuestUserByIp(ip: string): Promise<UserOrNull> {

        const result = await this.database.query(
            `SELECT *
             FROM users
             WHERE is_guest = 1
               AND ip_address = ?
             ORDER BY created_at DESC
             LIMIT 1`, [ip]);

        return result.firstRow(User);
    }

    static async updateLastLoggedIn(userId: number): Promise<void> {

    }

    static async findByAuthToken(loginToken: string): NullablePromise<User> {

        let result = await this.db().query('SELECT * FROM users WHERE auth_token = ? LIMIT 1', [loginToken]);
        return result.firstRow(User);
    }

    static async getUserBadgesForChannel(user_ids: Array<number>, channel: User) {

        let result = await this.db().query(`
            SELECT badges.*, user_channel_badges.user_id
            FROM user_channel_badges
                     LEFT JOIN badges ON user_channel_badges.badge_id = badges.id
            WHERE user_id IN (?)
              AND (channel_id = ? OR channel_id IS NULL)

        `, [user_ids, channel.id]);

        let ret: Map<number, Array<string>> = new Map<number, Array<string>>();

        let temp = _.groupBy(result.getRows(), 'user_id');

        Object.keys(temp).forEach(function (userId) {

            let badges = _.map(temp[userId], 'name');

            // admin badge is not added by default
            if (parseInt(userId) == channel.id) {
                badges.push('Admin');
            }

            ret.set(parseInt(userId), badges);
        });

        return ret;
    }

    async findManyById(ids: Array<number>): Promise<Array<User>> {

        if (!ids.length) {
            return [];
        }

        let result = await this.database.query('SELECT * FROM users WHERE id IN (?)', [ids]);

        if (result.error) {
            return Promise.reject(result.error);
        }

        return result.getRowsAsModels(User);
    }

    async findById(id: number): NullablePromise<User> {

        let users = await this.findManyById([id]);

        if (users.length) {
            return users[0];
        }

        return null;
    }

    async findByUid(uid: string): NullablePromise<User> {

        const result = await this.database.query(
            `SELECT *
             FROM users
             WHERE uid = ?`, [uid]);

        return result.firstRow(User);
    }

    async findByUsername(username: string): Promise<UserOrNull> {

        const result = await this.database.query(
            `SELECT *
             FROM users
             WHERE username = ?
             LIMIT 1`, [username]
        );

        return result.firstRow(User);
    }

    async findFirstByNamePartial(name: string): Promise<User[]> {

        const wc = `%${name}%`;

        const result = await this.database.query(
            `SELECT *
             FROM users
             WHERE display_name LIKE ?`, [wc]
        )

        return result.getRowsAsModels(User);
    }

    async update(uid: string, values: Partial<User>): Promise<boolean> {

        const result = await this.database.update(
            "users",
            {...values},
            {uid: uid}
        );

        return result.success();
    }

    async updateDisplayName(user: User, newDisplayName: string): Promise<boolean> {

        if (user.display_name !== newDisplayName) {
            const result = await this.database.query(
                `UPDATE users
                 SET display_name            = ?,
                     display_name_updated_at = UTC_TIMESTAMP()
                 WHERE id = ?`, [newDisplayName, user.id]);

            return result.success();
        }

        return false;
    }

    async patch(id: number, entity: User) {

        const result = await this.database.query(
            `UPDATE users
             SET username = ?
             WHERE id = ?`, [entity.username, entity.id]
        );

        return result.success();
    }

    async deleteByUid(uid: string): Promise<boolean> {

        const result = await this.database.query(
            `UPDATE users
             SET deleted_at = UTC_TIMESTAMP()
             WHERE uid = ?`, [uid]
        )

        return result.success();
    }

    async getUsersInRoom(room: number) {

        const result = await this.database.query(
            `SELECT *
             FROM users
             WHERE id IN (SELECT user_id
                          FROM connections
                          WHERE room_id = ?
                            AND updated_at >= DATE_SUB(UTC_TIMESTAMP(), INTERVAL 10 MINUTE)
                            AND deleted_at IS NULL)`, [room]
        );

        return result.getRowsAsModels(User);
    }
}