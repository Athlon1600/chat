import {RoomRepository} from "../repositories/RoomRepository";
import {SocketEventBroadcaster} from "../SocketEventBroadcaster";
import {User} from "../models/User";
import _ from "lodash";
import {Room} from "../models/Room";
import {CacheService} from "./CacheService";
import {DateUtils} from "../util/DateUtils";
import {ChatMessageRepository} from "../repositories/ChatMessageRepository";
import NotFoundException from "../exceptions/NotFoundException";
import {NullablePromise} from "../types";
import UnauthorizedException from "../exceptions/UnauthorizedException";
import {UserService} from "./UserService";

const roomRepo = new RoomRepository();
const messageRepository = new ChatMessageRepository();

export class RoomService {

    static async findById(id: number): NullablePromise<Room> {
        return roomRepo.findById(id);
    }

    static async findByUid(uid: string): NullablePromise<Room> {
        return roomRepo.findByUid(uid);
    }

    static async findOrFail(uid: string): Promise<Room> {

        const room = await roomRepo.findByUid(uid);

        if (!room) {
            throw new NotFoundException(`Room ${uid} not found!`);
        }

        return room;
    }

    static async createForUser(user: User, room: Room): NullablePromise<Room> {

        const newRoomId = await roomRepo.create(room, user);

        if (newRoomId) {
            return roomRepo.findById(newRoomId);
        }

        return null;
    }

    static async updateOrFail(uid: string, room: Room, user?: User): NullablePromise<Room> {

        if (user) {

            const canUpdate = await RoomService.canUpdateRoom(user, uid);

            if (!canUpdate) {
                throw new UnauthorizedException("You are not allowed to update this room");
            }
        }

        const roomNow = await this.findByUid(uid);

        if (roomNow) {
            roomNow.fill(room);

            await roomRepo.patch(roomNow);

            SocketEventBroadcaster.emitRoomUpdated(roomNow);
        }

        return null;
    }

    static async updateRoomNameOrFail(uid: string, newName: string): NullablePromise<Room> {

        const room = await this.findOrFail(uid);
        room.fill({name: newName});

        return this.updateOrFail(uid, room);
    }

    static async updateSlowModeOrFail(uid: string, seconds: number): NullablePromise<Room> {
        const room = await this.findOrFail(uid);
        room.fill({slow_mode: seconds});

        return this.updateOrFail(uid, room);
    }

    // TODO: authorizedForUpdate()
    static async canUpdateRoom(user: User, roomUid: string): Promise<boolean> {

        if (UserService.isRootUser(user)) {
            return true;
        }

        const rooms = await roomRepo.findAllForUser(user);
        return _.map(rooms, "uid").includes(roomUid);
    }

    static async deleteAllMessagesFromRoom(user: User, room: Room): Promise<number> {

        const allowed = await this.canUpdateRoom(user, room.uid);

        if (!allowed) {
            return -1;
        }

        const count = await messageRepository.deleteByRoom(room);

        // TODO: notify server socket
        if (count) {
            SocketEventBroadcaster.emitRoomPurged(room.uid);
        }

        return count;
    }

    static async getRemainTimeForPostingMessage(room: Room, sender: User): Promise<number> {

        // if it ever was set below 1
        const maxSeconds = room.slow_mode > 0 ? room.slow_mode : 1;

        // @ts-ignore
        const messageLastSentAt = await CacheService.getMessageLastSent(room.id, sender.id);

        if (!messageLastSentAt) {
            return 0;
        }

        const timeLeft = (messageLastSentAt + maxSeconds) - DateUtils.timestampInSeconds();

        return Math.max(0, timeLeft);
    }

    static async deleteByUid(uid: string, user?: User): Promise<boolean> {

        if (user) {

            const canUpdate = await RoomService.canUpdateRoom(user, uid);

            if (!canUpdate) {
                throw new UnauthorizedException();
            }
        }

        await roomRepo.deleteByUid(uid);

        return true;
    }
}