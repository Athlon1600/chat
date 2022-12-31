import {Nullable} from "../types";

export class Collection<T> {

    public readonly items: Array<T>;

    constructor(items: Array<T>) {
        this.items = items;
    }

    public first(): Nullable<T> {

        if (this.items.length > 0) {
            return this.items[0];
        }

        return null;
    }
}