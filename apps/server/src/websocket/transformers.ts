import {ChatMessage} from "../models/ChatMessage";
import {ChatMessageInterface, RoomInterface, UserInterface} from "@athlon1600/chat-typings";
import {User} from '../models/User';
import {Room} from "../models/Room";

interface TransformerAbstract<T> {
    transform(data: any): T;
}

export const userEntityToUser = (user: User): UserInterface => {

    return {
        uid: user.uid,
        displayName: user.display_name,
        picture: user.picture_url,
        countryCode: "",
        balance: 0,
        roles: []
    };
}

export const roomEntityToRoom = (room: Room): RoomInterface => {

    return {
        uid: room.uid,
        name: room.name,
        description: room.description,
        slowMode: room.slow_mode
    };
}

export const messageEntityToEvent = (msg: ChatMessage): ChatMessageInterface => {

    let temp: ChatMessageInterface = {
        id: msg.id,
        timestamp: Date.now(),
        message: msg.message_text || "",
        user: null as any
    }

    temp.user = {
        uid: "",
        displayName: msg.user?.display_name || "",
        countryCode: "",
        picture: "",
        balance: 0,
        roles: []
    }

    return temp;
}