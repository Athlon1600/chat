import {OkPacket} from "mysql";
import {EntityModel} from "../../models/EntityModel";
import {Nullable} from "../../types";
import {BaseModel} from "../BaseModel";

export class QueryResult {

    public error: string = "";
    protected rows: Array<Object> = [];
    protected info: OkPacket | null = null;

    constructor(error: string, rows: Array<Object>, info: OkPacket | null) {
        this.error = error;
        this.rows = rows;

        if (info) {
            this.info = info;
        }
    }

    getRows(): Array<Object> {
        return this.rows;
    }

    getFirstRowValue(name: string) {

        if (this.getRows()) {
            const firstRow: { [key: string]: any } = this.rows[0];

            return firstRow.hasOwnProperty(name) ? firstRow[name] : null;
        }

        return null;
    }

    getRowsAsModels<T extends EntityModel>(type: { new(): T; }): Array<T> {

        let result = new Array<T>();

        this.rows.forEach(function (model) {

            let temp: T = new type();
            temp.forceFill(model);

            result.push(temp);
        });

        return result;
    }

    success(): boolean {
        return !this.error;
    }

    hasRows(): boolean {
        return this.rows.length > 0;
    }

    firstRow<T extends EntityModel>(type: { new(): T; }): Nullable<T> {

        let models = this.getRowsAsModels(type);

        if (models.length) {
            return models[0];
        }

        return null;
    }

    getInsertId() {

        if (this.info && this.info.insertId) {
            return this.info.insertId;
        }

        return null;
    }

    getInfo(): Nullable<OkPacket> {
        return this.info;
    }
}