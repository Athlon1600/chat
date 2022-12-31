import {Request, Response} from "express";
import {UserRepository} from "../repositories/UserRepository";
import {UserResource} from "../resources/UserResource";
import {ChatMessageResource} from "../resources/ChatMessageResource";
import {RoomService} from "../services/RoomService";
import {RoomsController} from "../http/controllers/RoomsController";
import {ChatMessageService} from "../services/ChatMessageService";
import {RoomResource} from "../resources/RoomResource";
import UnauthorizedException from "../exceptions/UnauthorizedException";
import {SafeRouter} from "../framework/routing/SafeRouter";

const safeRouter = new SafeRouter();

safeRouter.get('/', RoomsController.index);
safeRouter.post('/', RoomsController.create);
safeRouter.get('/:uid', RoomsController.read);
safeRouter.patch('/:uid', RoomsController.update);
safeRouter.delete('/:uid', RoomsController.delete);

safeRouter.get('/:uid/messages', async function (req: Request, res: Response) {

    const {uid} = req.params;

    const room = await RoomService.findOrFail(uid);
    const messages = await ChatMessageService.findRecentByRoom(room);

    res.json({
        error: null,
        room: RoomResource.make(room).toArray(),
        messages: ChatMessageResource.collectionAsArray(messages ?? []),
    });

});

safeRouter.delete('/:uid/messages', async function (req: Request, res: Response) {

    const roomId: string = req.params['uid'];

    if (!req.user) {
        throw new UnauthorizedException();
    }

    const room = await RoomService.findOrFail(roomId);

    await RoomService.deleteAllMessagesFromRoom(req.user, room);

    return res.status(204);

});

safeRouter.get('/:uid/users', async function (req: Request, res: Response) {

    const uid = req.params['uid'];

    const room = await RoomService.findOrFail(uid);
    const users = await (new UserRepository()).getUsersInRoom(room.id);

    // envelop
    res.json({
        room: RoomResource.make(room).toArray(),
        users: UserResource.collectionAsArray(users),
        error: null
    });

});

export const rooms = safeRouter.router;
