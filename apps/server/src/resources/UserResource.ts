import {User} from "../models/User";
import {JsonResource} from "../framework/JsonResource";
import {UserInterface} from "@athlon1600/chat-typings";

export class UserResource extends JsonResource<User> {

    toArray(): UserInterface {
        let user: User = this.resource;

        return {
            uid: user.uid,
            displayName: user.display_name,
            picture: user.picture_url,
            countryCode: user.country_code,
            balance: 0,
            roles: user.roles || []
        }
    }
}