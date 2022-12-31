import {ObjectWithStringKeys} from "../../types";

export class ObjectUtils {

    public static replaceUndefinedWithNull(obj: { [key: string]: any }): void {

        Object.keys(obj).forEach(function (key: string, index: number) {

            if (obj[key] === undefined) {
                obj[key] = null;
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                ObjectUtils.replaceUndefinedWithNull(obj[key]);
            }

        });
    }

    static removeUndefined(obj: { [key: string]: any }): void {

        Object.keys(obj).forEach(function (key) {

            if (obj[key] === undefined) {
                delete obj[key]
            }
        });
    }

    // https://commons.apache.org/proper/commons-lang/apidocs/org/apache/commons/lang3/ObjectUtils.html
    static allNull(...values: any[]): boolean {
        return values.find((value) => value !== null) === undefined;
    }

    static isEmpty(obj: object): boolean {
        return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
    }

    static isString = function (value: any) {
        return (typeof value === "string" || Object.prototype.toString.call(value) === "[object String]");
    }

    static isPlainObject = function (value: any) {
        return (Object.prototype.toString.call(value) === "[object Object]");
    }

    static isJSON = function (str: string | number, options: { allowObjects?: any; }) {

        if (options === void 0) {
            options = {};
        }

        if (ObjectUtils.isPlainObject(str) && options.allowObjects === true) {
            return true;
        }

        if (!ObjectUtils.isString(str)) {
            return false;
        }
        /*        if (!isNaN(str)) {
                    return false;
                }
                try {
                    JSON.parse(str);
                } catch (error) {
                    return false;
                }*/
        return true;
    }

    static constructByKeyPrefix(obj: ObjectWithStringKeys, prefix: string): Object {

        let result: any = Object.create({});

        Object.keys(obj).forEach(function (key) {

            if (key.startsWith(prefix)) {

                let newKey = key.substr(prefix.length);

                result[newKey] = obj[key];
            }

        });

        return result;
    }
}