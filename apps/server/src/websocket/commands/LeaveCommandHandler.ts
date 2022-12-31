import {CommandHandler} from "../../types";
import {SocketSession} from "../SocketSession";
import {ChatCommand} from "../ChatCommand";

export const LeaveCommandHandler: CommandHandler = async function (command: ChatCommand, session: SocketSession) {

    await session.leaveRoom();
}