import {AbstractRepository} from "./AbstractRepository";
import {Moderator} from "../models/Moderator";
import {User} from "../models/User";
import {Room} from "../models/Room";
import {NullablePromise} from "../types";

export class ModeratorRepository extends AbstractRepository<Moderator> {

    async getUserRoomModStatus(user: User, room: Room): NullablePromise<Moderator> {

        const result = await this.database.query(
            `SELECT *
             FROM moderators
             WHERE user_id = ?
               AND room_id = ?
               AND deleted_at IS NULL
             ORDER BY id DESC`, [user.id, room.id]
        );

        return result.firstRow(Moderator);
    }

    async removeMod(user: User, room: Room): Promise<boolean> {

        const result = await this.database.query(
            `UPDATE moderators
             SET deleted_at = UTC_TIMESTAMP()
             WHERE user_id = ?
               AND room_id = ?
               AND deleted_at IS NULL`,
            [user.id, room.id]
        );

        return result.success();
    }

    async addMod(user: User, room: Room): Promise<boolean> {

        const result = await this.database.query(
            `INSERT INTO moderators (created_at, updated_at, user_id, room_id)
             VALUES (UTC_TIMESTAMP(), UTC_TIMESTAMP(), ?, ?)`, [user.id, room.id]
        );

        return result.success();
    }
}