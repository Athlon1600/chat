import {Database} from "../database";
import {StaticThisWithArgs} from "../types";
import {EntityModel} from "../models/EntityModel";

export abstract class AbstractRepository<T extends EntityModel> {

    protected database: Database;

    // TODO: database inside constructor?
    constructor() {
        this.database = Database.getInstance();
    }

    public static getInstance<T>(this: StaticThisWithArgs<T>): T {
        return new this();
    }

    async findOrFail(id: number): Promise<T> {
        throw new Error("implemented");
    }

    // TODO: rename connection()
    static db(): Database {
        return Database.getInstance();
    }
}