import {Constructor} from "../types";
import {StringUtils} from "./StringUtils";

export class CommonUtil {

    static toNumberArray(arr: Array<any>): Array<number> {

        let result = new Array<number>();

        arr.forEach(function (val) {

            let num = parseInt(val, 10);

            if (!isNaN(num)) {
                result.push(num);
            }
        });

        return result;
    }

/*    static plainToClass<T>(target: Constructor<T>, object: any, excludeExtraneousValues: boolean = false): T {
        const instance = new target();

        if (excludeExtraneousValues) {
            Object.keys(instance).forEach((key) => (instance as any)[key] = object[key]);
        } else {
            Object.assign(instance, object);
        }

        return instance;
    }

    static plainToClassOnly<T>(target: Constructor<T>, object: any): T {
        return this.plainToClass(target, true);
    }*/

    static objectFromAny(data: any): Object {

        if (typeof data === 'string') {

            try {
                return JSON.parse(data);
            } catch (e) {
                return {};
            }
        }

        return StringUtils.jsonParseOrDefault(data, {});
    }
}