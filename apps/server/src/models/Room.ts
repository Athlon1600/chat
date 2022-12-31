import {EntityModel} from "./EntityModel";
import {User} from "./User";

export class Room extends EntityModel {

    public id: number = 0;
    public uid: string = "";
    public name: string = "";
    public description: string = "";

    public slow_mode: number = 0;
    public user_id: number = 0;

    public created_at: string = "";
    public updated_at: string = "";

    // relations
    public user?: User;
}