import {CommandHandler} from "../../types";

export const DisconnectCommandHandler: CommandHandler = async function (command, session) {

    await session.disconnect();
}