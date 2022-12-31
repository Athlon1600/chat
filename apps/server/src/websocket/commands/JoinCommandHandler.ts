import {CommandHandler} from "../../types";
import {RoomService} from "../../services/RoomService";

export const JoinCommandHandler: CommandHandler = async function (command, session) {

    // can be either name or uid - try finding
    const uid = command.args.trim();

    if (uid) {

        const room = await RoomService.findByUid(uid);

        // TODO: if !kill or !kick make it IMPOSSIBLE for that user to join
        if (room) {
            await session.joinRoom(room);
        } else {
            session.sendError('no such room found');
        }
    }
}