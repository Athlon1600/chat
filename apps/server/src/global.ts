import {Constructor} from "./types";

// convertToEntity, plainToEntity
export function superPlainToInstance<T extends object>(target: Constructor<T>, object: any): T {

    const instance = new target();

    Object.keys(instance).forEach((key) => {

        if (typeof object === 'object' && key in object) {
            (instance as any)[key] = object[key]
        }

    });

    return instance;
}
