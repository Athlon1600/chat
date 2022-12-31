import {formatDuration, formatISO9075, intervalToDuration, subSeconds} from "date-fns";
import {ObjectUtils} from "../framework/util/ObjectUtils";

export class DateUtils {

    public static readonly SECONDS_IN_DAY = 60 * 60 * 24;
    public static readonly SECONDS_IN_HOUR = 60 * 60;

    static isDateValid(date: any): boolean {
        const dt = new Date(date);
        return !isNaN(dt.getTime());
    }

    static intervalToSeconds(interval: string, defaultValue: number = 0): number {

        let total = 0;

        if (!interval) {
            return defaultValue;
        }

        let seconds = interval.match(/(\d+)\s*s/);
        let minutes = interval.match(/(\d+)\s*m/);
        let hours = interval.match(/(\d+)\s*h/);
        let days = interval.match(/(\d+)\s*d/);
        let weeks = interval.match(/(\d+)\s*w/);

        if (ObjectUtils.allNull(seconds, days, hours, minutes)) {
            return defaultValue;
        }

        if (seconds) {
            total += parseInt(seconds[1]);
        }

        if (days) {
            total += parseInt(days[1]) * 86400;
        }

        if (hours) {
            total += parseInt(hours[1]) * 3600;
        }

        if (minutes) {
            total += parseInt(minutes[1]) * 60;
        }

        return total;
    }

    static msToSec(ms: number): number {
        return Math.ceil(ms / 1000);
    }

    static timestampInSeconds(): number {
        let seconds = new Date().getTime() / 1000;
        return Math.ceil(seconds);
    }

    static getSecondsSince(date: any): number {

        const ms = Date.parse(date);

        if (isNaN(ms)) {
            return 0;
        }

        return this.timestampInSeconds() - this.msToSec(ms);
    }

    static getTimeStringForMySQL(date: Date = new Date()): string {
        return formatISO9075(date);
    }

    static secondsToHuman(seconds: number): string {

        const now = new Date();
        const before = subSeconds(now, seconds);

        const duration = intervalToDuration({
            start: now,
            end: before
        });

        return formatDuration(duration);
    }
}