import {Request, Response} from "express";
import {UserService} from "../../services/UserService";
import {DateUtils} from "../../util/DateUtils";
import {RoomService} from "../../services/RoomService";
import {BanService} from "../../services/BanService";
import {CrudController} from "../CrudController";
import UnauthorizedException from "../../exceptions/UnauthorizedException";
import BadRequestException from "../../exceptions/BadRequestException";

export class BanController extends CrudController {

    static async index(req: Request, res: Response) {

        res.json({
            message: 'Nothing to see here yet'
        });
    }

    static async create(req: Request, res: Response) {

        const params = req.body as { user: string, ip_address: string, room: string, duration: string, reason: string };

        if (!req.user) {
            throw new UnauthorizedException();
        }

        const durationString = params.duration || "";
        const durationInSeconds = DateUtils.intervalToSeconds(durationString);

        if (durationInSeconds < 1) {

            return res.json({
                error: `Invalid duration: ${durationString}`
            })
        }

        const user = await UserService.findByUidOrFail(params.user);
        const room = await RoomService.findByUid(params.room);

        if (user && room) {

            await BanService.banUser(req.user, user, room, durationInSeconds, params.reason);

            return res.json({
                message: 'Success'
            });
        }

        throw new BadRequestException();
    }

    static async unban(req: Request, res: Response) {

        const data = req.body as { user: string, room: string };

        if (!req.user) {
            throw new UnauthorizedException();
        }

        const user = await UserService.findByUidOrFail(data.user);
        const room = await RoomService.findOrFail(data.room);

        await BanService.unbanUser(req.user, user, room);

        res.json({
            message: 'Success'
        });
    }
}