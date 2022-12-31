import {ParsedQs} from "qs";

export class SafeQuery {

    private query: ParsedQs;

    private constructor(query: ParsedQs) {
        this.query = query;
    }

    public getString(key: string): string {

        if (key in this.query) {
            return this.query[key] as string;
        }

        return "";
    }

/*
    public getNumber(key: string): number {

        if (key in this.query) {
            let str = this.query[key] as string;
            return parseInt(str);
        }

        return null;
    }
*/

    static parse(query: ParsedQs) {
        return new SafeQuery(query);
    }
}