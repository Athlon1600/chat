import {ChatMessageRepository} from "../repositories/ChatMessageRepository";
import {CacheService} from "./CacheService";
import {User} from "../models/User";
import {Room} from "../models/Room";
import {SocketEventBroadcaster} from "../SocketEventBroadcaster";
import {ChatMessage} from "../models/ChatMessage";
import {RoomService} from "./RoomService";
import {UserService} from "./UserService";
import {BanService} from "./BanService";
import NotFoundException from "../exceptions/NotFoundException";
import {messageEntityToEvent} from "../websocket/transformers";
import {UserRepository} from "../repositories/UserRepository";
import {AbstractService} from "./AbstractService";
import InvalidArgumentException from "../exceptions/InvalidArgumentException";

const messageRepo = new ChatMessageRepository();
const userRepo = new UserRepository();

export class ChatMessageService extends AbstractService<ChatMessage, ChatMessageRepository> {

    static new() {
        return new this(new ChatMessageRepository());
    }

    static async findOrFail(id: number): Promise<ChatMessage> {
        const message = await messageRepo.find(id);

        if (!message) {
            throw new NotFoundException('Message not found');
        }

        message.user = await userRepo.findById(message.user_id);

        return message;
    }

    static async findRecentByRoom(room: Room, limit: number = 20, offset: number = 0) {

        // involves expensive table scans... DO NOT allow
        if (offset < 0 || offset > 200) {
            throw new InvalidArgumentException("Cannot seek this far.");
        }

        const result = messageRepo.findRecentByRoom(room);

        return result;
    }

    static async canPostMessageInRoom(sender: User, room: Room): Promise<boolean> {

        const banStatus = await BanService.getBanStatus(sender, room);
        return banStatus.isNotBanned();
    }

    static async insertMessage(sender: User, room: Room, messageText: string, broadcast: boolean = true): Promise<number> {

        // are we permitted to post in this room?
        const allow = await this.canPostMessageInRoom(sender, room);

        //         if(!roomUser) throw new HttpStatusError(401, "Unauthorized user")
        // something that can be catched inside safeHandler()
        if (!allow) {
            return -1;
        }

        // are we sending messages too fast?
        const wait = await RoomService.getRemainTimeForPostingMessage(room, sender);
        if (wait > 0) {
            return -1;
        }

        const newId = await messageRepo.saveMessage(sender.id, room.id, messageText);

        // if success
        if (newId) {
            await CacheService.updateMessageLastSent(room.id, sender.id);

            if (broadcast) {
                const newMessage = await messageRepo.find(newId);

                if (newMessage) {

                    if (newMessage.user) {
                        newMessage.user.roles = await UserService.getUserRoles(sender, room);
                    }

                    SocketEventBroadcaster.emitNewMessage(newMessage, room);
                }
            }
        }

        return newId;
    }

    static async postMessageOrFail(sender: User, room: Room, messageText: string, broadcast: boolean = true): Promise<number> {

        const result = await this.insertMessage(sender, room, messageText, broadcast);

        if (result === -1) {
            throw new Error('Failed to post message. You are either banned or you are posting too fast');
        }

        return result;
    }

    static async canUserDeleteMessagesInRoom(user: User, room: Room): Promise<boolean> {

        if (UserService.isRootUser(user)) {
            return true;
        }

        return user && user.id === room.user_id;
    }

    static async deleteOrFail(user: User, message: ChatMessage): Promise<boolean> {

        const room = await RoomService.findById(message.room_id);

        if (!room) {
            throw new Error("Invalid message");
        }

        const isMod = await this.canUserDeleteMessagesInRoom(user, room);

        if (message.user_id !== user.id && !isMod) {
            throw new Error(`User: ${user.username} is not allowed to delete this message`);
        }

        let result = await messageRepo.deleteById(message.id);
        SocketEventBroadcaster.emitMessageDeleted(message.id);

        return result;
    }
}
