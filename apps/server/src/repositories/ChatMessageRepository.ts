import {AbstractRepository} from "./AbstractRepository";
import {ChatMessage} from "../models/ChatMessage";
import {Room} from "../models/Room";
import {NullablePromise} from "../types";
import {UserRepository} from "./UserRepository";
import {EntityRepository, FindOptions} from "../framework/database/EntityRepository";
import {ArrayUtils} from "../framework/util/ArrayUtils";
import {UserService} from "../services/UserService";

declare type MESSAGE_RELATIONS = "user" | "room";

const users = new UserRepository();

export class ChatMessageRepository extends AbstractRepository<ChatMessage> implements EntityRepository<ChatMessage> {

    async find(id: number, relations?: MESSAGE_RELATIONS[]): NullablePromise<ChatMessage> {
        const result = await this.database.query('SELECT * FROM chat_messages WHERE id = ? AND deleted_at IS NULL', [id]);

        const message = result.firstRow(ChatMessage);

        if (message) {
            message.user = await users.findById(message.user_id);
        }

        return message;
    }

    async findMany(options: FindOptions): Promise<ChatMessage[]> {
        const result = await this.database.query("SELECT * FROM chat_messages LIMIT ?", [options.limit || 30]);
        return result.getRowsAsModels(ChatMessage);
    }

    protected async loadUsersWithRoles(rows: ChatMessage[], roomContext?: Room): Promise<void> {

        const userIds = rows.map((message: ChatMessage) => message.user_id);

        const temp = await users.findManyById(userIds);

        if (roomContext) {
            await UserService.loadRolesFor(temp, roomContext);
        }

        const usersById = ArrayUtils.keyBy(temp, "id");

        rows.forEach((msg: ChatMessage) => {
            msg.user = usersById.get(msg.user_id.toString());
        });
    }

    async findRecentByRoom(room: Room, limit: number = 20): Promise<ChatMessage[]> {

        let result = await this.database.query(
            `SELECT *
             FROM chat_messages
             WHERE room_id = ?
               AND deleted_at IS NULL
             ORDER BY id DESC
             LIMIT ?`, [room.id, limit]
        );

        const messages = result.getRowsAsModels(ChatMessage);
        await this.loadUsersWithRoles(messages, room);

        // in ascending order
        return messages.reverse();
    }

    // TODO: who deleted it?
    async deleteById(id: number): Promise<boolean> {

        let result = await this.database.query(
            'UPDATE chat_messages SET deleted_at = NOW() WHERE id = ?', [id]
        );

        return result.success();

        // return result.getInfo()?.affectedRows > 0;
    }

    async saveMessage(sender: number, room: number, message: string): Promise<number> {

        let res = await this.database.query(
            'INSERT INTO chat_messages (created_at, room_id, user_id, message_text) VALUES (UTC_TIMESTAMP(), ?, ?, ?)',
            [room, sender, message]
        );

        return res.getInsertId() ?? 0;
    }

    async getLastMessageSentAt(sender: number, room: number): NullablePromise<Date> {

        const result = await this.database.query(`
            SELECT created_at
            FROM chat_messages
            WHERE user_id = ?
              AND room_id = ?
              AND deleted_at IS NULL
            ORDER BY created_at DESC
            LIMIT 1`, [sender, room]);

        const value = result.getFirstRowValue("created_at");
        return value ? new Date(value) : null;
    }

    async deleteByRoom(room: Room, softDelete: boolean = true): Promise<number> {
        const result = await this.database.query(
            `UPDATE chat_messages
             SET deleted_at = UTC_TIMESTAMP()
             WHERE room_id = ?
               AND deleted_at IS NULL`, [room.id]);

        const info = result.getInfo();

        return info ? info.affectedRows : 0;
    }
}