import {Request, Response} from "express";
import {RoomService} from "../../services/RoomService";
import {RoomResource} from "../../resources/RoomResource";
import NotImplementedException from "../../exceptions/NotImplementedException";
import BadRequestException from "../../exceptions/BadRequestException";
import UnauthorizedException from "../../exceptions/UnauthorizedException";
import {Room} from "../../models/Room";
import {superPlainToInstance} from "../../global";
import InvalidArgumentException from "../../exceptions/InvalidArgumentException";

export class RoomsController {

    static async index(req: Request, res: Response) {
        throw new NotImplementedException();
    }

    static async create(req: Request, res: Response) {

        if (!req.user) {
            throw new UnauthorizedException();
        }

        const roomData = superPlainToInstance(Room, req.body);

        if (!roomData.name) {
            throw new BadRequestException("Missing parameter: name");
        }

        const newRoom = await RoomService.createForUser(req.user, roomData);

        if (!newRoom) {
            throw new InvalidArgumentException("Failed to create a room. Something went wrong");
        }

        return res.json({
            room: RoomResource.make(newRoom).toArray()
        });
    }

    static async read(req: Request, res: Response) {
        const uid = req.params['uid'];

        const room = await RoomService.findOrFail(uid);

        return res.json({
            room: RoomResource.make(room).toArray()
        });
    }

    static async update(req: Request, res: Response) {

        const uid = req.params['uid'];
        const data = req.body as { name: string, description: string, slow_mode: number };

        if (!req.user) {
            throw new BadRequestException();
        }

        const newData = superPlainToInstance(Room, data);

        await RoomService.updateOrFail(uid, newData, req.user);

        return res.json({
            status: 200
        });
    }

    static async delete(req: Request, res: Response) {

        const {uid} = req.params;

        if (!req.user) {
            throw new UnauthorizedException();
        }

        if (uid) {
            await RoomService.deleteByUid(uid, req.user);
        }

        res.json({
            success: true
        });
    }
}