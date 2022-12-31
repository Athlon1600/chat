import {EntityModel} from "./EntityModel";
import {USER_ROLE} from "@athlon1600/chat-typings";

export class User extends EntityModel {

    public static defaultImageUrl: string = '';

    public id: number = 0;
    public uid: string = "";
    public username: string = "";

    // auth
    public is_guest: boolean = false;
    public password: string = "";
    public auth_token: string = "";

    public display_name: string = "";
    public display_name_updated_at: string = "";

    public ip_address: string = "";
    public country_code: string = "";

    public picture_url: string = "";

    // public bio: string;
    // public socials: Array<string> = [];

    // will also depend on context for example if in certain room or not
    public roles: Array<USER_ROLE> = [];
    // public badges: Array<string> = ['vip'];
}
