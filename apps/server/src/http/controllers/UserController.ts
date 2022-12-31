import {Request, Response} from "express";
import {UserService} from "../../services/UserService";
import {UserResource} from "../../resources/UserResource";
import NotImplementedException from "../../exceptions/NotImplementedException";
import UnauthorizedException from "../../exceptions/UnauthorizedException";

export class UserController {

    static async index(req: Request, res: Response) {
        throw new NotImplementedException();
    }

    static async read(req: Request, res: Response) {

        const params = req.params as { uid: string };

        let user;

        if (params.uid) {
            user = await UserService.findByUidOrFail(params.uid);
        } else {

            if (!req.user) {
                throw new UnauthorizedException();
            }

            user = req.user;
        }

        res.json({
            user: UserResource.make(user).toArray()
        });
    }

    static async update(req: Request, res: Response) {

        const params = req.params as { uid: string };
        const updateData = req.body as { display_name: string };

        if (!req.user) {
            throw new UnauthorizedException();
        }

        const user = params.uid ? await UserService.findByUidOrFail(params.uid) : req.user;

        if (updateData.display_name) {
            await UserService.updateDisplayName(user, updateData.display_name, req.user);
        }

        return res.status(204).send("");
    }

    static async delete(req: Request, res: Response) {
        throw new NotImplementedException();
    }
}