import {EntityModel} from "./EntityModel";
import {Room} from "./Room";
import {User} from "./User";

export class RoomBan extends EntityModel {

    public start_time: string = "";
    public end_time: string = "";
    public reason: string = "";

    public user_id: number = 0;
    public moderator_id: number = 0;
    public room_id: number = 0;

    // relations
    public user?: User;
    public room?: Room;
}