import {JsonResource} from "../framework/JsonResource";
import {Room} from "../models/Room";
import {RoomInterface} from "@athlon1600/chat-typings";

export class RoomResource extends JsonResource<Room> {

    toArray(): RoomInterface {
        const room = this.resource;

        return {
            uid: room.uid,
            name: room.name,
            description: room.description,
            slowMode: Math.max(room.slow_mode, 3)
        }
    }
}