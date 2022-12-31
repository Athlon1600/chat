import IORedis from 'ioredis';
import {NullablePromise} from "../types";
import {StringUtils} from "../util/StringUtils";
import {Config} from "../config";

export class RedisManager {

    protected static client: IORedis;

    private constructor() {
        // private
    }

    private static initialize() {

        const client = new IORedis({
            host: Config.redis.host,
            port: Config.redis.port,
            connectTimeout: 5000,
            lazyConnect: true,
            showFriendlyErrorStack: true,
            maxRetriesPerRequest: 0
        });

        client.on('error', (err: Error) => {
            throw err;
        });

        this.client = client;
    }

    static getClientInstance(): IORedis {

        if (RedisManager.client === undefined) {
            this.initialize();
        }

        return RedisManager.client;
    }

    public static async getObjectOrSet<T>(key: string, fn: () => Promise<T>, ex?: number): NullablePromise<T> {

        const client = this.getClientInstance();

        const result = await client.get(key);

        if (result !== null) {
            let obj = StringUtils.jsonParseOrDefault(result, result);

            // @ts-ignore
            return obj;
        }

        const data = await fn();

        if (data !== undefined) {
            let value = (typeof data === 'string') ? data : JSON.stringify(data);

            await client.set(key, value);

            if (ex) {
                // client.expire(key, ex)
            }

            return data;
        }

        return null;
    }
}