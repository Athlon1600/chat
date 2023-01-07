import {ChatCommand} from "../ChatCommand";
import {CommandHandler} from "../../types";
import {SocketSession} from "../SocketSession";
import {UserService} from "../../services/UserService";
import {BanCommandParser} from "../BanCommandParser";
import {BanService} from "../../services/BanService";

export const BanCommandHandler: CommandHandler = async function (command: ChatCommand, session: SocketSession) {

    const banOptions = BanCommandParser(command);

    if (!banOptions.success) {
        return session.sendError("Invalid command format. Example format: !ban bob 1d for spamming")
    }

    const user = await session.getUser();
    const room = await session.getCurrentRoom();

    if (!(user && room)) {
        return session.sendError('You are not logged in or in any room');
    }

    const canBan = await BanService.canUserBanPeopleInRoom(user, room);

    if (!canBan) {
        return session.sendError("You do not have permissions to ban anyone in this room");
    }

    const matchingUser = await UserService.findUniqueByPartialName(banOptions.username);

    if (matchingUser) {

        if (matchingUser.id === user.id) {
            // return session.sendError('Cannot ban/unban yourself!');
        }

        if (command.name === 'ban') {

            const banResult = await BanService.banUser(user, matchingUser, room, banOptions.duration, banOptions.reason);

            session.sendServerMessage(JSON.stringify(banResult));

        } else if (command.name === 'unban') {

            const result = await BanService.unbanUser(user, matchingUser, room);

            session.sendServerMessage(JSON.stringify(result));
        }

    } else {
        session.sendError(`No such user found: "${banOptions}"`);
    }
}
