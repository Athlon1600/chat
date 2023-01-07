import {Room} from "../models/Room";
import {User} from "../models/User";
import {BanRepository} from "../repositories/BanRepository";
import {UserService} from "./UserService";
import {ActiveBan} from "../ActiveBan";
import {ModerationService} from "./ModerationService";
import UnauthorizedException from "../exceptions/UnauthorizedException";
import {RoomBan} from "../models/RoomBan";
import {DateUtils} from "../util/DateUtils";

const banRepository = new BanRepository();

// TODO: BanCheckService, BanWriteService
export class BanService {

    static async getBanStatus(user: User, room: Room, ip_address?: string): Promise<ActiveBan> {

        if (ip_address) {
            const temp = await UserService.getLastUsedIpAddress(user);
        }

        const activeBans = await banRepository.findByUser(user, ip_address);

        const firstBan = activeBans.find((ban: RoomBan) => {
            return (ban.room_id === null || ban.room_id === room.id);
        });

        if (firstBan !== undefined && DateUtils.isDateValid(firstBan.end_time)) {
            return new ActiveBan(new Date(firstBan.end_time), firstBan.reason);
        }

        return ActiveBan.empty();
    }

    static async canUserBanPeopleInRoom(admin: User, room: Room): Promise<boolean> {
        // TODO:
        // return admin.roles.includes('admin', 'root');
        const isMod = await ModerationService.isModeratorOfRoom(admin, room);
        return isMod || UserService.isRootUser(admin);
    }

    static async banUser(admin: User, user: User, room: Room, duration: number, reason: string = ""): Promise<boolean> {

        const canBan = await this.canUserBanPeopleInRoom(admin, room);

        if (!canBan) {
            throw new UnauthorizedException();
        }

        // check if already banned
        const banStatus = await this.getBanStatus(user, room);

        // already banned?
        if (banStatus.isBanned()) {
            return false;
        }

        return banRepository.banUser(admin, user, room, duration, reason);
    }

    static async unbanUser(moderator: User, user: User, room: Room): Promise<boolean> {

        const canUnban = await this.canUserBanPeopleInRoom(moderator, room);

        if (!canUnban) {
            throw new Error('Permission denied');
        }

        return banRepository.unbanUser(moderator, user, room);
    }
}