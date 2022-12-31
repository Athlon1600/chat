import {CommandHandler} from "../../types";
import {SocketSession} from "../SocketSession";
import {ChatCommand} from "../ChatCommand";
import {RoomService} from "../../services/RoomService";

export const PurgeCommandHandler: CommandHandler = async function (command: ChatCommand, session: SocketSession) {

    const user = await session.getUser();
    const room = await session.getCurrentRoom();

    // force user to enter 10:20am as captcha
    // idea: purge all messages from user
    if (user && room) {

        if (await RoomService.canUpdateRoom(user, room.uid)) {
            await RoomService.deleteAllMessagesFromRoom(user, room);
        }
    }
}