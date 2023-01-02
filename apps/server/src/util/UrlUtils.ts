import {Nullable} from "../types";

export class UrlUtils {

    public static trimSlashStart(str: string) {
        return str.replace(/^\/+/, '');
    }

    public static trimSlashEnd(str: string) {
        return str.replace(/\/+$/, '');
    }

    public static trimSlash(str: string) {
        return this.trimSlashStart(this.trimSlashEnd(str));
    }

    static addHttp(url: string) {

        if (!url.startsWith('http')) {
            return 'http://' + url;
        }

        return url;
    }

    static build(host: string, path: string) {
        host = this.addHttp(host);
        return this.trimSlash(host) + '/' + this.trimSlashStart(path);
    }

    static parseUrlOrNull(url: string): Nullable<URL> {

        try {
            return new URL(url);
        } catch (e) {

        }

        return null;
    }
}