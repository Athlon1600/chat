import {Request, Response} from "express";
import {UserService} from "../../services/UserService";
import {RoomService} from "../../services/RoomService";
import {ModerationService} from "../../services/ModerationService";

export class UserModeratorController {

    static async mod(req: Request, res: Response) {

        const {uid} = req.params;
        const data = req.body as { room: string, global: number };

        const user = await UserService.findByUidOrFail(uid);
        const room = await RoomService.findOrFail(data.room);

        if (req.user) {
            await ModerationService.setModeratorOrFail(req.user, user, room);
        }

        return res.json({
            status: "202 Accepted"
        });
    }

    static async unmod(req: Request, res: Response) {

        const {uid} = req.params;
        const data = req.body as { room: string };

        const user = await UserService.findByUidOrFail(uid);
        const room = await RoomService.findOrFail(data.room);

        if (req.user) {
            await ModerationService.unmod(req.user, user, room);
        }

        return res.json({
            status: "202 Accepted"
        });
    }
}