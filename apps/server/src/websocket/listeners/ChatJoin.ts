import {UserRepository} from "../../repositories/UserRepository";
import {RoomRepository} from "../../repositories/RoomRepository";
import {ChatMessageRepository} from "../../repositories/ChatMessageRepository";
import {SocketEventHandler} from "../../types";
import {SocketSession} from "../SocketSession";
import {messageEntityToEvent, roomEntityToRoom, userEntityToUser} from "../transformers";
import {JoinEvent} from "@athlon1600/chat-typings";
import {DateUtils} from "../../util/DateUtils";
import {User} from "../../models/User";

const channelRepo = new RoomRepository();

export const ChatJoin: SocketEventHandler = async function (connection: SocketSession, payload: JoinEvent) {

    const uid = payload.uid;

    if (!uid) {
        return;
    }

    const newRoom = await channelRepo.findByUid(uid);

    if (newRoom) {

        const currentRoom = await connection.getCurrentRoom();
        const currentUser = await connection.getUser();

        await connection.joinRoom(newRoom);

        connection.socket.emit('room_updated', {
            room: roomEntityToRoom(newRoom)
        });

        const messages = await (new ChatMessageRepository()).findRecentByRoom(newRoom);

        const events = messages.map((msg) => {
            return messageEntityToEvent(msg);
        });

        connection.socket.emit('room_messages', {
            messages: events
        });

        const roomUsers = await (new UserRepository()).getUsersInRoom(newRoom.id);

        connection.socket.emit('room_users', {
            users: roomUsers.map((user: User) => {
                return userEntityToUser(user);
            })
        })

    } else {

        connection.socket.emit('error', {
            timestamp: DateUtils.timestampInSeconds(),
            message: 'No such room exists!'
        });
    }

};
