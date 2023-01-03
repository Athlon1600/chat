import {PoolConfig} from "mysql";
import {UrlUtils} from "./util/UrlUtils";
import process from "process";

const toUrlOrNull = (): URL | null => {

    if (process.env.DATABASE_URL) {
        const url = UrlUtils.parseUrlOrNull(process.env.DATABASE_URL);

        if (url) {
            return url;
        }
    }

    return null;
};

export class DatabaseConfigParser {

    public static fromEnv(): PoolConfig {

        // DATABASE_URL => URL() object
        const url = toUrlOrNull();
        const urlPath = (url && url.pathname.length > 1) ? url.pathname.substring(1) : "";

        return {
            host: process.env.DB_HOST || url?.hostname || "localhost",
            user: process.env.DB_USERNAME || url?.username || "root",
            password: process.env.DB_PASSWORD || url?.password || "",
            database: process.env.DB_DATABASE || urlPath || "",
            port: +(process.env.DB_PORT || url?.port || 3306)
        }
    }
}