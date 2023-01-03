import {PoolConfig} from "mysql";
import process from "process";
import {DatabaseConfigParser} from "./DatabaseConfigParser";

// Will not override if any of the values below are set by Docker
require('dotenv').config({
    override: false
});

interface ServerConfigInterface {
    server: { port: number },
    database: PoolConfig,
    redis: { host: string; port: number }
}

const dbConfig: PoolConfig = DatabaseConfigParser.fromEnv();

export const Config: ServerConfigInterface = {
    server: {
        port: (process.env.PORT || 3000) as number
    },
    database: dbConfig,
    redis: {
        host: process.env.REDIS_HOST || "127.0.0.1",
        port: (process.env.REDIS_PORT || 6379) as number
    }
}

