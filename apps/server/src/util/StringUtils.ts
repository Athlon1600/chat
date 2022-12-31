import {AxiosError} from "axios";

export class StringUtils {

    static readonly URL_SAFE_CHARACTERS = '[a-zA-Z0-9-._~]';

    static parseIntOrDefault(s: string, defaultValue: number = 0): number {
        const result = parseInt(s);
        return isNaN(result) ? defaultValue : result;
    }

    static trimQuotes(str: string): string {
        return this.customTrim(str, "\"'");
    }

    static customTrim(str: string, chars: string): string {

        let startFrom = 0;
        let endAt = str.length;

        if (typeof chars !== 'string') {
            chars = '';
        }

        // trim from left
        for (let i = 0; i < str.length; i++) {
            const char = str.charAt(i);

            if (chars.includes(char)) {
                startFrom++;
            } else {
                break;
            }
        }

        // trim from right
        for (let i = str.length - 1; i >= 0; i--) {
            const char = str.charAt(i);

            if (chars.includes(char)) {
                endAt--;
            } else {
                break;
            }
        }

        return str.slice(startFrom, endAt);
    }

    static jsonParseOrDefault(data: any, defaultValue: any = null): any {

        try {
            return JSON.parse(data);
        } catch (e) {
            return defaultValue;
        }
    }

    static random(maxLength: number = 16): string {

        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        let result = '';
        let charactersLength = characters.length;

        for (let i = 0; i < maxLength; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        return result;
    }

    static toString(str: any): string {

        if (typeof str === 'object') {

            if (str.isAxiosError) {

                let axiosError = str as AxiosError;

                if (axiosError.response) {
                    return this.toString(axiosError.response.data);
                } else if (axiosError.message) {
                    return axiosError.message;
                }
            }

            return JSON.stringify(str);
        }

        return str;
    }

    static lengthBetween(str: string, min: number, max: number): boolean {
        return str.length >= min && str.length <= max;
    }

    static generateColorFromString(str: string) {

        // https://github.com/benawad/dogehouse/blob/fd03ee0ebd2c2a2eac3f8f1ad65b65fc771e11b8/pilaf/src/modules/room/chat/useRoomChatStore.ts#L35
        let colors = [
            '#0000FF',
            '#FF7F50',
            '#1E90FF',
            '#00FF7F',
            '#9ACD32'
        ];

        // return '#FF0000';

        if (!str) {
            return '#000000';
        }

        let sum = 0;
        for (let x = 0; x < str.length; x++) sum += x * str.charCodeAt(x);
        return colors[sum % colors.length];
    }
}