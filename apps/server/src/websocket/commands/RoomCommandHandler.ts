import {CommandHandler} from "../../types";
import {SocketSession} from "../SocketSession";
import {ChatCommand} from "../ChatCommand";
import {RoomService} from "../../services/RoomService";
import InvalidArgumentException from "../../exceptions/InvalidArgumentException";

export const RoomCommandHandler: CommandHandler = async function (command: ChatCommand, session: SocketSession) {

    const room = await session.getCurrentRoom();

    if (command.argumentArray.length >= 2 && room) {

        const field = command.argumentArray[0];

        if (field === 'name' || field === 'title') {

            const fullTitle = command.argumentArray.slice(1).join(' ');

            await RoomService.updateRoomNameOrFail(room.uid, fullTitle);

        } else if (field === 'description') {
            // TODO
        } else if (field === 'slow') {

            const seconds = parseInt(command.argumentArray[1]);

            if (!isNaN(seconds) || seconds < 3) {
                await RoomService.updateSlowModeOrFail(room.uid, seconds);
            } else {
                throw new InvalidArgumentException('Invalid number or less than 3');
            }
        }
    }
}