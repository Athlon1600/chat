import {User} from "../models/User";
import {Room} from "../models/Room";

export class ChatCommand {

    public name: string = "";
    public args: string = "";

    // TODO: ability to pull in the first 3 and combine 4, 5, 6 with [4]th
    public argumentArray: Array<string> = [];

    public sender?: User;
    public channel?: Room;

    private constructor() {
        // do nothing
    }

    static isCommand(text: string) {
        return text.startsWith('!') && text.length > 1;
    }

    // !COMMAND_SLUG unlimited number of args
    static parse(text: string): ChatCommand {

        if (this.isCommand(text)) {

            let spacePos = text.indexOf(' ');

            let command = text.slice(1, spacePos > 0 ? spacePos : 5555);
            let args = '';

            if (spacePos > 0) {
                args = text.slice(spacePos + 1);
            }

            const chatCommand = new ChatCommand();
            chatCommand.name = command;
            chatCommand.args = args;
            chatCommand.argumentArray = this.parseArguments(args);

            return chatCommand;
        }

        throw 'Failed to parse ChatCommand from: ' + text;
    }

    public static parseArguments(str: string): Array<string> {
        const matches = str.match(/(?:[^\s"]+|"[^"]*")+/g);
        return matches ?? [];
    }

    toString() {
        return `command=${this.name}, args: ${this.args}`;
    }
}