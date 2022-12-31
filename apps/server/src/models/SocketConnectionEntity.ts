import {EntityModel} from "./EntityModel";
import {User} from "./User";
import {Room} from "./Room";

export class SocketConnectionEntity extends EntityModel {

    public id: number = 0;
    public socket_id: string = "";
    public ip_addr: string = "";
    private userAgent: string = "";

    public created_at: string = "";
    public updated_at: string = "";

    // should remain private
    public user_id: number = 0;
    public channel_id: number = 0;

    // relations
    public user?: User;
    public room?: Room;
}