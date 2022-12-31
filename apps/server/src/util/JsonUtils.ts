export class JsonUtils {

    public static stringifyWithUndefined(value: any): string {

        const replacer = (key: string, value: any) => {
            return typeof value === 'undefined' ? null : value;
        }

        return JSON.stringify(value, replacer);
    }
}