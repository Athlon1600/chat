import {User} from "../models/User";
import {Room} from "../models/Room";
import {ModeratorRepository} from "../repositories/ModeratorRepository";
import {UserService} from "./UserService";
import UnauthorizedException from "../exceptions/UnauthorizedException";
import {Moderator} from "../models/Moderator";
import {NullablePromise} from "../types";

const moderatorRepository = new ModeratorRepository();

export class ModerationService {

    async canPurgeMessages(user: User, room: Room): Promise<boolean> {
        return false;
    }

    static async getUserRoomModStatus(user: User, room: Room): NullablePromise<Moderator> {
        return moderatorRepository.getUserRoomModStatus(user, room);
    }

    static async isModeratorOfRoom(user: User, room: Room): Promise<boolean> {

        if (user.id === room.user_id) {
            return true;
        }

        const status = await moderatorRepository.getUserRoomModStatus(user, room);

        if (status) {
            return status.room_id === room.id || status.room_id === null;
        }

        return false;
    }

    static async canAddModerators(admin: User, room: Room): Promise<boolean> {
        return UserService.isRootUser(admin) || admin.id === room.user_id;
    }

    static async setModeratorOrFail(admin: User, user: User, room: Room): Promise<boolean> {

        const canMod = await this.canAddModerators(admin, room);

        if (!canMod) {
            throw new UnauthorizedException();
        }

        // is already a moderator?
        const isMod = await this.isModeratorOfRoom(user, room);

        if (!isMod) {
            await moderatorRepository.addMod(user, room);
        }

        return true;
    }

    static async unmod(admin: User, user: User, room: Room): Promise<boolean> {

        const canMod = await this.canAddModerators(admin, room);

        if (!canMod) {
            throw new UnauthorizedException();
        }

        return moderatorRepository.removeMod(user, room);
    }
}