import {EntityModel} from "../models/EntityModel";
import {EntityRepository} from "../framework/database/EntityRepository";
import {NullablePromise} from "../types";
import NotFoundException from "../exceptions/NotFoundException";

export abstract class AbstractService<E extends EntityModel, R extends EntityRepository<E>> {

    protected readonly repository: R;

    constructor(repository: R) {
        this.repository = repository;
    }

    async find(id: number): NullablePromise<E> {
        return this.repository.find(id);
    }

    async findOrFail(id: number): Promise<E> {

        const result = await this.find(id);

        if (!result) {
            throw new Error("Not exist");
        }

        return result;
    }

    async findWithRelations(id: number): NullablePromise<E> {
        return this.repository.find(id, ["user", "room"]);
    }

    async findWithRelationsOrFail(id: number): Promise<E> {

        const result = await this.findWithRelations(id);

        if (!result) {
            throw new NotFoundException(`Entity with id=${id} was not found`);
        }

        return result;
    }
}