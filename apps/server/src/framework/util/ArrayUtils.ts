export class ArrayUtils {

    public static isNonEmptyArray(arr: any): boolean {
        return arr && Array.isArray(arr) && arr.length > 0;
    }

    public static removeInPlaceWhere<T>(arr: Array<T>, find: T, count: number = 1): void {

        if (count < 1) {
            return;
        }

        const index = arr.indexOf(find);

        if (index !== -1) {
            arr.splice(index, 1);

            this.removeInPlaceWhere(arr, find, count - 1);
        }
    }

    public static keyBy(arr: Array<any>, propertyName: string): Map<String, any> {

        const result = new Map<String, any>();

        arr.forEach((value) => {

            if (typeof value === 'object' && propertyName in value) {
                const someKey: string = value[propertyName];

                result.set(String(someKey), value);
            }


        });

        return result;
    }

    public static pluck<T>(arr: Array<Object>, propertyName: string): T[] {

        const result = new Array<T>();

        arr.forEach((value) => {

            if (propertyName in value) {
                // @ts-ignore
                result.push(value.propertyName);
            }

        });

        return result;
    }

    public static shrinkAndCombineArrayOfStrings(arr: Array<string>, newSize: number, separator: string = " ") {

        if (newSize < arr.length) {

            const smaller = arr.slice(0, newSize - 1);
            const remainder = arr.slice(newSize - 1);

            smaller.push(remainder.join(separator));

            return smaller;
        }

        return arr;
    }
}