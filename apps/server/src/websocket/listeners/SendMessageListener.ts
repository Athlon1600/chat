import {ChatCommand} from "../ChatCommand";
import {ChatMessageService} from "../../services/ChatMessageService";
import {SocketEventHandler} from "../../types";
import {SocketSession} from "../SocketSession";
import {MessageCommandHandler} from "../MessageCommandHandler";
import {RoomService} from "../../services/RoomService";
import {BanService} from "../../services/BanService";
import {SendMessageEvent} from "@athlon1600/chat-typings";

export const SendMessageListener: SocketEventHandler = async function (connection: SocketSession, payload: SendMessageEvent) {

    const text = payload.text;

    if (!text) {
        return connection.sendError("Empty text");
    }

    // we allow commands even for banned users
    const isCommand = ChatCommand.isCommand(text);

    // no rate limits for commands?
    if (isCommand) {
        const cmd = ChatCommand.parse(text);

        return MessageCommandHandler.handle(connection, cmd);
    }

    const user = await connection.getUser();
    const room = await connection.getCurrentRoom();

    if (!user) {
        return connection.sendError('Error: Unauthorized. Login first');
    }

    if (!room) {
        return connection.sendError('Not in any rooms at the moment');
    }

    // less expensive checks first
    if (await RoomService.getRemainTimeForPostingMessage(room, user) > 0) {
        connection.sendError('You are sending messages too quickly');
        return;
    }

    const banStatus = await BanService.getBanStatus(user, room);

    if (banStatus.getExpiresInSeconds()) {
        return connection.sendError(`You are banned from this channel. Your ban will expire in ${banStatus.getExpiresInHuman()}`);
    }

    const result = await ChatMessageService.insertMessage(user, room, text);

    // ChatMessageService.postMessageOrFail(user, room, text);
}
