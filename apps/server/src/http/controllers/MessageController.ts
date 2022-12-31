import {Request, Response} from "express";
import {CrudController} from "../CrudController";
import {RoomService} from "../../services/RoomService";
import {ChatMessageService} from "../../services/ChatMessageService";
import UnauthorizedException from "../../exceptions/UnauthorizedException";
import NotImplementedException from "../../exceptions/NotImplementedException";

export class MessageController extends CrudController {

    static async all(req: Request, res: Response) {
        throw new NotImplementedException();
    }

    static async create(req: Request, res: Response) {

        const data = req.body as { room: string, message: string };

        if (!req.user) {
            throw new UnauthorizedException();
        }

        if (!data.room || !data.message) {

            return res.json({
                error: "Missing room= or message= parameters"
            })
        }

        const room = await RoomService.findOrFail(data.room);
        const result = await ChatMessageService.postMessageOrFail(req.user, room, data.message);

        res.send({
            success: true,
            result,
        });
    }

    static async delete(req: Request, res: Response) {

        const params = req.params as any as { id: number }

        if (!req.user) {
            throw new UnauthorizedException("Missing authentication!");
        }

        const message = await ChatMessageService.findOrFail(params.id);
        const result = await ChatMessageService.deleteOrFail(req.user, message);

        return res.status(200).json({
            status: result
        });
    }
}