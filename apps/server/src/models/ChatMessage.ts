import {EntityModel} from "./EntityModel";
import {User} from "./User";
import {Room} from "./Room";
import {Nullable} from "../types";

export class ChatMessage extends EntityModel {

    public id: number = 0;
    public created_at: string = "";

    public room_id: number = 0;
    public user_id: number = 0;

    // body, text, content
    public message_text: string = "";

    public user: Nullable<User> = null;
    public room: Nullable<Room> = null;
}