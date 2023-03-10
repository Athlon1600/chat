import {SocketEventHandler} from "../../types";
import {SocketSession} from "../SocketSession";
import {userEntityToUser} from "../transformers";

export const AuthLogoutHandler: SocketEventHandler = async function (connection: SocketSession, payload: any) {

    const user = await connection.getUser();

    // are we even logged in??
    if (user) {

        connection.logout().then(() => {
            connection.socket.emit('auth_updated', {
                user: userEntityToUser(user)
            });
        });
    }
}