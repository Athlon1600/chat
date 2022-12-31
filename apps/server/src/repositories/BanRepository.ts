import {AbstractRepository} from "./AbstractRepository";
import {RoomBan} from "../models/RoomBan";
import {User} from "../models/User";
import {Room} from "../models/Room";

export class BanRepository extends AbstractRepository<RoomBan> {

    async findByUser(user: User, ip_address?: string) {

        const result = await this.database.query(
            `SELECT *
             FROM bans
             WHERE (user_id = ?
                 OR (? IS NOT NULL AND ip_address = ?)
                 )
               AND end_time > UTC_TIMESTAMP()
               AND deleted_at IS NULL`, [user.id, ip_address, ip_address]
        );

        return result.getRowsAsModels(RoomBan);
    }

    async banUser(moderator: User, user: User, room: Room, durationInSeconds: number = 3600, reason: string = ""): Promise<boolean> {

        const result = await this.database.query(
            `INSERT INTO bans (start_time, end_time, user_id, room_id, reason, moderator_id)
             VALUES (UTC_TIMESTAMP(), DATE_ADD(UTC_TIMESTAMP(), INTERVAL ? SECOND), ?, ?, ?, ?)`,
            [durationInSeconds, user.id, room.id, reason, moderator.id]
        );

        return result.success();
    }

    // unban by user AND ip - only room matters
    async unbanUser(moderator: User, user: User, room: Room): Promise<boolean> {

        const result = await this.database.query(
            `UPDATE bans
             SET deleted_at = UTC_TIMESTAMP()
             WHERE user_id = ?
               AND room_id = ?
               ANd deleted_at IS NULL`, [user.id, room.id]
        );

        return result.success();
    }

    /**
     *
     *
     * ban user from room:
     * user_id=, room_id=
     *
     * ban IP from room
     * ip_address=, room_id=
     *
     * global user ban:
     * user_id=
     *
     * global IP ban
     * ip_address=
     *
     */

    async unbanByUser(admin: User, user: User, room?: Room): Promise<boolean> {
        return true;
    }

    async unbanByIpAddress(admin: User, ip_address: string, room?: Room): Promise<boolean> {
        return true;
    }
}