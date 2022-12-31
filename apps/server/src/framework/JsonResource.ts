import {ObjectWithStringKeys} from "../types";

export class JsonResource<T extends Object> {

    protected resource: T;

    constructor(resource: T) {
        this.resource = resource;
    }

    public static make<Type>(data: Type) {
        // @ts-ignore
        return new this(data);
    }

    public static collectionAsArray<Type>(data: Array<Type>): Array<Object> {

        let arr: Array<Object> = [];

        for (let i = 0; i < data.length; i++) {
            let resource = this.make(data[i]);
            arr.push(resource.toArray());
        }

        return arr;
    }

    public toArray(): ObjectWithStringKeys {
        throw 'toArray() must be implemented!';
    }

    public toJson(): string {
        return JSON.stringify(this.toArray());
    }

    /*    public static toArray(data: Type): Object {
            return this.make(data).toArray();
        }*/
}