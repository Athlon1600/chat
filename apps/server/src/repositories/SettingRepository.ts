import {AbstractRepository} from "./AbstractRepository";
import {Setting} from "../models/Setting";
import {NullablePromise} from "../types";

export class SettingRepository extends AbstractRepository<Setting> {

    async findById(id: number): NullablePromise<Setting> {

        const result = await this.database.query(
            `SELECT *
             FROM settings
             WHERE id = ?`, [id]
        );

        return result.firstRow(Setting);
    }

    async findByName(name: string): NullablePromise<Setting> {

        const result = await this.database.query(
            `SELECT *
             FROM settings
             WHERE name = ?`, [name]
        );

        return result.firstRow(Setting);
    }

    async createOrUpdate(name: string, value: string): Promise<void> {

        const existing = await this.findByName(name);

        if (existing) {

            await this.database.query(
                `UPDATE settings
                 SET value      = ?,
                     updated_at = UTC_TIMESTAMP()
                 WHERE name = ?
                 LIMIT 1`, [value, name]
            );

        } else {

            await this.database.query(
                `INSERT INTO settings (created_at, updated_at, name, value)
                 VALUES (UTC_TIMESTAMP(), UTC_TIMESTAMP(), ?, ?)`, [name, value]
            );
        }
    }

    async deleteByName(name: string): Promise<void> {

        await this.database.query(
            `DELETE
             FROM settings
             WHERE name = ?`, [name]
        );
    }

    // TODO: cache it
    async getAll(): Promise<Map<string, string>> {

        const data = new Map<string, string>();

        const result = await this.database.query(
            `SELECT *
             FROM settings`, []
        );

        result.getRowsAsModels(Setting).forEach((value) => {
            data.set(value.name, value.value);
        });

        return data;
    }
}