import {UserRepository} from "../../repositories/UserRepository";
import {RoomRepository} from "../../repositories/RoomRepository";
import {RoomResource} from "../../resources/RoomResource";
import {ChatMessageRepository} from "../../repositories/ChatMessageRepository";
import {UserResource} from "../../resources/UserResource";
import {SocketEventHandler} from "../../types";
import {SocketSession} from "../SocketSession";
import {messageEntityToEvent} from "../transformers";
import {JoinEvent} from "@athlon1600/chat-typings";

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
            room: RoomResource.make(newRoom).toArray()
        });

        const messages = await (new ChatMessageRepository()).findRecentByRoom(newRoom);

        const events = messages.map((msg) => {
            return messageEntityToEvent(msg);
        });

        connection.socket.emit('room_messages', {
            messages: events
        });

        connection.socket.emit('room_users', {
            users: UserResource.collectionAsArray(await (new UserRepository()).getUsersInRoom(newRoom.id))
        })

    } else {
        connection.socket.emit('error', 'No such room exists!');
    }

};
