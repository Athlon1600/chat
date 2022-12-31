import {CommandHandler} from "../../types";
import {SocketSession} from "../SocketSession";
import {ChatCommand} from "../ChatCommand";
import {UserService} from "../../services/UserService";
import {DateUtils} from "../../util/DateUtils";

export const NameCommandHandler: CommandHandler = async function (command: ChatCommand, session: SocketSession) {

    const newName: string = command.args;

    const currentUser = await session.getUser();

    if (currentUser) {

        const seconds = DateUtils.getSecondsSince(currentUser.display_name_updated_at);

        if (false && seconds && seconds < DateUtils.SECONDS_IN_DAY) {
            session.sendError('You can only change your name once a day');
            return;
        }

        await UserService.updateDisplayName(currentUser, newName);
    }
}