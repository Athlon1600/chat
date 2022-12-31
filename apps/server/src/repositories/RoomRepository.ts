import {AbstractRepository} from "./AbstractRepository";
import {Room} from "../models/Room";
import {User} from "../models/User";
import {StringUtils} from "../util/StringUtils";
import {NullablePromise} from "../types";

export class RoomRepository extends AbstractRepository<Room> {

    async findByUid(uid: string): NullablePromise<Room> {
        let result = await this.database.query(
            `SELECT *
             FROM rooms
             WHERE uid = ?
               AND deleted_at IS NULL`, [uid]);

        return result.firstRow(Room);
    }

    async findById(id: number): NullablePromise<Room> {

        const result = await this.database.query(
            `SELECT *
             FROM rooms
             WHERE id = ?
               AND deleted_at IS NULL`, [id]
        );

        return result.firstRow(Room);
    }

    async findAll(): Promise<Room[]> {

        const result = await this.database.query(
            `SELECT *
             FROM rooms
             WHERE deleted_at IS NULL`, []
        );

        return result.getRowsAsModels(Room);
    }

    async findMany(ids: Array<number>): Promise<Room[]> {

        const result = await this.database.query(
            `SELECT *
             FROM rooms
             WHERE id IN (?)`, [ids]
        );

        return result.getRowsAsModels(Room);
    }

    async findAllForUser(user: User): Promise<Room[]> {

        if (!user.id) {
            return [];
        }

        const result = await this.database.query(`
            SELECT *
            FROM rooms
            WHERE user_id = ?`, [user.id]);

        return result.getRowsAsModels(Room);
    }

    async create(room: Room, user: User): Promise<number> {

        const uid = StringUtils.random(12);

        const result = await this.database.query(`
            INSERT INTO rooms
                (created_at, user_id, uid, name, description, slow_mode)
            VALUES (UTC_TIMESTAMP(), ?, ?, ?, ?, 3)`, [user.id, uid, room.name, room.description]
        );

        return result.getInsertId() ?? 0;
    }

    async patch(room: Room): Promise<boolean> {

        if (room.id) {

            const result = await this.database.query(
                `UPDATE rooms
                 SET name        = ?,
                     description = ?,
                     slow_mode   = ?
                 WHERE id = ?`, [room.name, room.description, room.slow_mode, room.id]
            );

            return result.success();
        }

        return false;
    }

    async deleteByUid(uid: string): Promise<boolean> {

        const result = await this.database.query(
            `UPDATE
                 rooms
             SET deleted_at = UTC_TIMESTAMP()
             WHERE uid = ?
               AND deleted_at IS NULL`, [uid]
        );

        return result.success();
    }
}