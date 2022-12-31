import {CommandHandler} from "../../types";
import {SocketSession} from "../SocketSession";
import {ChatCommand} from "../ChatCommand";

export const LogoutCommandHandler: CommandHandler = async (command: ChatCommand, session: SocketSession) => {

    const currentUser = await session.getUser();

    // TODO: logout out of EVERYWHERE or current session only?
    if (currentUser) {
        session.logout().then();
    }
}