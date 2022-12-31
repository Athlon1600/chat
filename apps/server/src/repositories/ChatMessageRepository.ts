import {AbstractRepository} from "./AbstractRepository";
import {ChatMessage} from "../models/ChatMessage";
import {Room} from "../models/Room";
import {NullablePromise} from "../types";
import {UserRepository} from "./UserRepository";
import {ArrayUtils} from "../framework/util/ArrayUtils";
import {EntityRepository, FindOptions} from "../framework/database/EntityRepository";
import {User} from "../models/User";
import {UserService} from "../services/UserService";

const users = new UserRepository();

declare type MESSAGE_RELATIONS = "user" | "room";

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

    protected async loadUserRelations(rows: ChatMessage[], room?: Room): Promise<ChatMessage[]> {

        const userIds = rows.map((message: ChatMessage) => message.user_id);

        const temp = await users.findManyById(userIds);

        temp.forEach((user: User) => {

            if (UserService.isRootUser(user)) {
                user.roles.push("root");
            }

            if (room && room.user_id === user.id) {
                user.roles.push("owner");
            }

        });

        const usersById = ArrayUtils.keyBy(temp, "id");

        rows.forEach((msg: ChatMessage) => {
            msg.user = usersById.get(msg.user_id.toString());
        });

        return rows;
    }

    async findRecentByRoom(room: Room, limit: number = 20): Promise<ChatMessage[]> {

        let messages = await this.database.query(
            `SELECT *
             FROM chat_messages
             WHERE room_id = ?
               AND deleted_at IS NULL
             ORDER BY id DESC
             LIMIT 20`, [room.id]
        );

        let models = messages.getRowsAsModels(ChatMessage);
        await this.loadUserRelations(models, room);

        // in ascending order
        return models.reverse();
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