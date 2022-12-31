import {PoolConfig} from "mysql";
import process from "process";

// Will not override if any of the values below are set by Docker
require('dotenv').config({
    override: false
});

interface ServerConfigInterface {
    server: { port: number },
    database: PoolConfig,
    redis: { host: string; port: number }
}

const pc: PoolConfig = {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_DATABASE || "",
    port: +(process.env.DB_PORT || 3306)
}

export const Config: ServerConfigInterface = {
    server: {
        port: (process.env.PORT || 3000) as number
    },
    database: pc,
    redis: {
        host: process.env.REDIS_HOST || "127.0.0.1",
        port: (process.env.REDIS_PORT || 6379) as number
    }
}

