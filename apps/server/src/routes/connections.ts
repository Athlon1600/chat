import {Request, Response} from "express";
import {SocketEventBroadcaster} from "../SocketEventBroadcaster";
import {SafeRouter} from "../framework/routing/SafeRouter";
import NotImplementedException from "../exceptions/NotImplementedException";

const safeRouter = new SafeRouter();

safeRouter.get('/', async function (req: Request, res: Response) {
    throw new NotImplementedException()
});

safeRouter.delete('/:socketId', async function (req: Request, res: Response) {

    const {socketId} = req.params;

    if (socketId && req.admin) {
        SocketEventBroadcaster.disconnectBySocketId(socketId);
    }

    res.json({
        success: true
    });

});

export const connections = safeRouter.router;
