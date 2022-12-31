import {SocketSession} from "../SocketSession";
import {SessionService} from "../../services/SessionService";

export const onDisconnect = async function (connection: SocketSession) {

    console.log(`Disconnect: ${connection.getConnectionId()}`);

    await SessionService.disconnect(connection.getConnectionId());
}