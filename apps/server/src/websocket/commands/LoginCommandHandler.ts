import {CommandHandler} from "../../types";
import {ChatCommand} from "../ChatCommand";
import {SocketSession} from "../SocketSession";
import {UserRepository} from "../../repositories/UserRepository";
import {UserService} from "../../services/UserService";

// TODO: no longer needed?
export const LoginCommandHandler: CommandHandler = async (command: ChatCommand, connection: SocketSession) => {

    const token: string = command.args.trim();

    const currentUser = await connection.getUser();

    if (token) {

        const newUser = await UserRepository.findByAuthToken(token);

        if (newUser) {
            await connection.setUser(newUser);
        } else {
            connection.sendError("No such user found");
        }

    } else {

        if (currentUser) {
            return connection.sendError('Already logged in!');
        }

        // login as guest
        const guestUser = await UserService.findOrCreateByIp(connection.getRemoteAddress());

        if (guestUser) {
            await connection.setUser(guestUser);
        } else {
            connection.sendError('Failed to login as guest...');
        }
    }
}