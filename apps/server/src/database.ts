import mysql, {MysqlError, OkPacket, Pool, PoolConnection} from "mysql";
import {QueryResult} from "./framework/database/QueryResult";
import {QueryBuilder} from "./framework/database/QueryBuilder";
import {Nullable, ObjectWithStringKeys} from "./types";
import {Config} from "./config";

// TODO: move this to framework/database
export class Database {

    protected static instance: Database;
    protected pool: Pool;

    public static queryLog: Array<string> = new Array<string>();

    private constructor() {
        this.pool = mysql.createPool(Config.database);
    }

    public static getInstance(): Database {

        if (!Database.instance) {
            Database.instance = new Database();
        }

        return Database.instance;
    }

    protected rawQuery(query: string, params: any): Promise<any> {

        const oThis = this;

        Database.queryLog.push(query);

        return new Promise(function (resolve, reject) {

            oThis.pool.getConnection(async function (err: MysqlError, connection: PoolConnection) {

                if (err) {

                    // invalid credentials will create no connection
                    if (connection) {
                        connection.release();
                    }

                    return reject(err);
                }

                connection.query(query, params, function (err: Nullable<MysqlError>, result, fields) {
                    connection.release();

                    if (err) {
                        return reject(err);
                    }

                    // Select => array of RowDataPacket
                    // Insert => single OkPacket object
                    // update => single OkPacket object
                    // delete => single OkPacket object
                    resolve(result);
                });

            });
        });
    }

    public async query(query: string, values: any): Promise<QueryResult> {

        let error: string = "";
        let rows = [];
        let info: OkPacket | null = null;

        // the purpose of this is to capture any possible Error
        // so that the promise returned from main block never fails
        try {

            let temp = await this.rawQuery(query, values);

            if (typeof temp === 'object' && temp.constructor.name === 'OkPacket') {
                info = temp;
            } else if (Array.isArray(temp)) {
                rows = JSON.parse(JSON.stringify(temp));
            }

        } catch (ex) {
            error = (ex as Error).toString();
        }

        let queryResult = new QueryResult(error, rows, info);

        return Promise.resolve(queryResult);
    }

    public async update(table: string, values: ObjectWithStringKeys, where?: any): Promise<QueryResult> {

        let sql = QueryBuilder.generateUpdateQuery(table, values, where);

        return this.query(sql, []);
    }

    public async ping(): Promise<number> {

        const start = Date.now();

        const result = await this.query('SELECT NOW()', []);

        if (result.error) {
            throw result.error;
        }

        return Date.now() - start;
    }
}
