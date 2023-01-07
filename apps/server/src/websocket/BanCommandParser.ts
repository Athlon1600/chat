import {ChatCommand} from "./ChatCommand";
import {ArrayUtils} from "../framework/util/ArrayUtils";
import {DateUtils} from "../util/DateUtils";
import {StringUtils} from "../util/StringUtils";

interface BanCommandStruct {
    success: boolean;
    username: string;
    duration: number;
    reason: string;
}

// !ban {user} {duration} {reason}
// if user contains spaces, "it needs to be quoted"
export const BanCommandParser = (command: ChatCommand): BanCommandStruct => {

    const parts = ArrayUtils.shrinkAndCombineArrayOfStrings(command.argumentArray, 3);

    let username;
    let durationString;
    let reason;

    [username = "", durationString = "", reason = ""] = parts;

    username = StringUtils.trimQuotes(username);
    reason = StringUtils.trimQuotes(reason);

    const durationSeconds = DateUtils.intervalToSeconds(durationString, DateUtils.SECONDS_IN_DAY);

    if (username.length >= 3 && durationSeconds > 0) {

        return {
            success: true,
            username,
            duration: durationSeconds,
            reason
        };
    }

    return {
        success: false,
        username,
        duration: durationSeconds,
        reason
    }
}
