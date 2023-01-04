import {Request, Response} from "express";
import {Database} from "../../database";
import {RandomUtils} from "../../util/RandomUtils";
import {InternetUtils} from "../../util/InternetUtils";
import {StringUtils} from "../../util/StringUtils";
import * as os from "os";
import {DateUtils} from "../../util/DateUtils";
import BadRequestException from "../../exceptions/BadRequestException";

export class HomeController {

    static index(req: Request, res: Response) {

        return res.json({
            status: "OK",
            // uniquely identifies this server
            hostname: os.hostname(),
            load: os.loadavg(),
            uptime: DateUtils.secondsToHuman(os.uptime()),
            openapi_url: ''
        });
    }

    static async health(req: Request, res: Response) {

        // if any checks fail -> return non 200
        try {
            const dur = await Database.getInstance().ping();

            res.json({
                ping: dur
            });

        } catch (e) {
            res.json({
                error: "" + e
            })
        }
    }

    static async random(req: Request, res: Response) {

        return res.json({
            username: RandomUtils.randomUsername(),
            password: StringUtils.random(16)
        });
    }

    static async geoip2(req: Request, res: Response) {

        const data = req.query as { ip: string };
        const ipAddress = data.ip || req.ip;

        const result = await InternetUtils.getIpLocation(ipAddress);

        return res.json({
            ip: ipAddress,
            headers: req.headers,
            data: result
        });
    }
}