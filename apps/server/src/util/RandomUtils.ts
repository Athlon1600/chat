const crypto = require("crypto");

const LETTERS = 'abcdefghijklmnopqrstuvwxyz';

export class RandomUtils {

    static randomName(prefix?: string): string {

        let str = '';

        if (prefix) {
            str += prefix;
        }

        str += this.randInt(12345, 99999);

        return str;
    }

    static randomLetter(): string {
        let num = RandomUtils.randInt(0, LETTERS.length);
        return LETTERS[num];
    }

    static randomString(length: number = 16) {
        let str = crypto.randomBytes(length * 2).toString('base64').toLowerCase();

        str = str.substr(0, length);

        return str.replace(/[^a-z0-9]/g, this.randomLetter);
    }

    static generateStreamKey() {
        return this.randomString(24);
    }

    static generateRandomGuestUsername() {
        return 'g' + this.randomString(19);
    }

    static randomUsername(): string {
        return 'user_' + this.randInt(1000, 9999999);
    }

    // inclusive, exclusive
    static randInt(min: number, max: number): number {
        return Math.floor(
            Math.random() * (max - min) + min
        )
    }
}
