import {EntityModel} from "../../models/EntityModel";

type NumberOrString = number | string;
type IdValue = NumberOrString;
type FieldValue = number | string;

export interface FindOptions {
    relations?: string[];
    offset?: number;
    limit?: number;
    orderByColumnName?: string;
    orderByDirection?: "asc" | "desc";
}

/**
 *
 *     deleteMany()
 *     deleteOne()
 *     find()
 *     findOne()
 *     findOneAndDelete()
 *     findOneAndUpdate()
 *     replaceOne()
 *     updateOne()
 *     updateMany()
 */
export interface EntityRepository<T extends EntityModel> {

    // FindOneOptions
    find(id: number, relations?: any[]): Promise<T | null>;

    // findOrFail(id: number): Promise<T>;
    // firstWhere(column: string, value: IdValue): Promise<T | null>;
    findMany(options: FindOptions): Promise<T[]>;

    // store(entity :T) : void --- auto fills new id inside entity.id
    // patch(id: number, entity: T): Promise<void>;
    // rawUpdate(id: IdValue, data: any): Promise<void>;

    // TODO: remove(T: entity)
    deleteById(id: number): Promise<boolean>;
}

