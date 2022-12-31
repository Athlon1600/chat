import {RawExpression} from "./RawExpression";
import {ObjectWithStringKeys} from "../../types";

const mysql = require('mysql');

export class QueryBuilder {

    public static generateUpdateQuery(table: string, values: ObjectWithStringKeys, where?: any): string {

        let valuesArray = [];
        let whereArray = [];

        for (let col in values) {
            let value = values[col];

            if (value === undefined) {
                continue;
            }

            if (value instanceof RawExpression) {
                valuesArray.push(`${col} = ${value.expr}`);
            } else {
                let escapedValue = mysql.escape(value);
                valuesArray.push(`${col} = ${escapedValue}`);
            }
        }

        for (let col in where) {
            let value = where[col];

            if (value instanceof Array) {

                let inString = value.map(function (val) {
                    return mysql.escape(val);
                }).join(',');

                if (value.length > 0) {
                    whereArray.push(`${col} IN (${inString})`);
                }

            } else {
                whereArray.push(`${col} = ${mysql.escape(value)}`);
            }
        }

        let valuesString = valuesArray.join(', ');
        let whereString = whereArray.join(' AND ');

        if (whereString) {
            return `UPDATE ${table}
                    SET ${valuesString}
                    WHERE ${whereString}`;
        }

        return `UPDATE ${table}
                SET ${valuesString}`;
    }
}