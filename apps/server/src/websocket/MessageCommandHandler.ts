import {ChatCommand} from "./ChatCommand";
import {EchoCommandHandler} from "./commands/EchoCommandHandler";
import {CommandHandler} from "../types";
import {SocketSession} from "./SocketSession";
import {LoginCommandHandler} from "./commands/LoginCommandHandler";
import {LogoutCommandHandler} from "./commands/LogoutCommandHandler";
import {NameCommandHandler} from "./commands/NameCommandHandler";
import {DisconnectCommandHandler} from "./commands/DisconnectCommandHandler";
import {JoinCommandHandler} from "./commands/JoinCommandHandler";
import {LeaveCommandHandler} from "./commands/LeaveCommandHandler";
import {BanCommandHandler} from "./commands/BanCommandHandler";
import {RoomCommandHandler} from "./commands/RoomCommandHandler";
import {PurgeCommandHandler} from "./commands/PurgeCommandHandler";

// TODO: when nodemon restart - no changes reflected

// https://www.rfc-editor.org/rfc/rfc1459.txt
const eventHandlerMap: Map<string, CommandHandler> = new Map();
eventHandlerMap.set('echo', EchoCommandHandler);
eventHandlerMap.set('login', LoginCommandHandler);
eventHandlerMap.set('logout', LogoutCommandHandler);
eventHandlerMap.set('name', NameCommandHandler);
eventHandlerMap.set('join', JoinCommandHandler);
eventHandlerMap.set('leave', LeaveCommandHandler);
eventHandlerMap.set('quit', DisconnectCommandHandler);

// admin
eventHandlerMap.set('room', RoomCommandHandler);
eventHandlerMap.set('ban', BanCommandHandler);
eventHandlerMap.set('unban', BanCommandHandler);
eventHandlerMap.set('purge', PurgeCommandHandler);

// /ns register password [email]
// w/whisper - send private
// announce => global message
// slow {number >= 3}

// also handle mentions:
// @admin --> auto mention whoever is admin
// @mods

export class MessageCommandHandler {

    public static async handle(connection: SocketSession, command: ChatCommand): Promise<void> {

        try {

            const user = await connection.getUser();
            const room = await connection.getCurrentRoom();

            const commandNameNormalized: string = command.name.toLowerCase();

            const handler = eventHandlerMap.get(commandNameNormalized);

            if (handler) {
                await handler(command, connection);
                return;
            }

            connection.sendError(`Command ${command.name} not found!`);

        } catch (ex) {
            // console.error(ex);

            if (ex instanceof Error) {
                connection.sendError(ex.toString());
            }
        }
    }

    public static registerHandler(commandName: string, handler: CommandHandler) {
        eventHandlerMap.set(commandName, handler);
    }
}