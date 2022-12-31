import {JsonResource} from "../framework/JsonResource";
import {ChatMessage} from "../models/ChatMessage";
import {UserResource} from "./UserResource";
import {ChatMessageInterface, UserInterface} from "@athlon1600/chat-typings";

export class ChatMessageResource extends JsonResource<ChatMessage> {

    toArray(): ChatMessageInterface {
        let chatMessage = this.resource;

        const result: ChatMessageInterface = {
            id: chatMessage.id,
            timestamp: new Date(chatMessage.created_at).getTime(),
            message: chatMessage.message_text
        }

        if (chatMessage.user) {
            result.user = UserResource.make(chatMessage.user).toArray() as UserInterface;
        }

        return result;
    }
}