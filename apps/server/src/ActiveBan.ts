import {differenceInSeconds, formatDuration, intervalToDuration} from "date-fns";

export class ActiveBan {

    private expiresAt: Date;
    private reason: string;

    // calc
    private readonly expiresIn: number = 0;
    private readonly duration: Duration;

    constructor(expiresAt: Date, reason: string) {
        this.expiresAt = expiresAt;
        this.reason = reason;

        const now = new Date();

        this.expiresIn = Math.max(0, differenceInSeconds(expiresAt, now));
        this.duration = intervalToDuration({
            start: now,
            end: expiresAt > now ? expiresAt : now
        });
    }

    static empty(): ActiveBan {
        return new ActiveBan(new Date(), "");
    }

    public isBanned(): boolean {
        return this.expiresIn > 0;
    }

    public isNotBanned(): boolean {
        return !this.isBanned();
    }

    public getExpiresInSeconds(): number {
        return this.expiresIn;
    }

    public getExpiresInHuman(): string {
        return formatDuration(this.duration);
    }
}