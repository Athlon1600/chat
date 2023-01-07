import {SocketEventHandler} from "../../types";
import {SocketSession} from "../SocketSession";
import {UserRepository} from "../../repositories/UserRepository";
import {LoginEvent} from "@athlon1600/chat-typings";
import {userEntityToUser} from "../transformers";

export const AuthLoginHandler: SocketEventHandler = async function (connection: SocketSession, payload: LoginEvent) {

    if (payload.token) {
        const user = await UserRepository.findByAuthToken(payload.token);

        if (user) {
            connection.setUser(user);
            // SocketEventBroadcaster.emitUserUpdated(user);

            connection.socket.emit('auth_updated', {
                user: userEntityToUser(user)
            });

            return;
        }
    }

    connection.sendError('Invalid login');
}