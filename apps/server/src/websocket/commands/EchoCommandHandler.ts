import {ChatCommand} from "../ChatCommand";
import {CommandHandler} from "../../types";
import {SocketSession} from "../SocketSession";

export const EchoCommandHandler: CommandHandler = async (command: ChatCommand, session: SocketSession) => {

    session.socket.emit("message", {
        system: 0,
        sender: 'System',
        chat_message: command.args
    });
}