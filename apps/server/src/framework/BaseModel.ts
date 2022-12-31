import {StaticThisWithArgs} from "../types";

export class BaseModel {

    // no idea why this works but it does....
    public static createFrom<T extends BaseModel>(this: StaticThisWithArgs<T>, data: object): T {

        let model = new this();
        model.forceFill(data);
        return model;
    }

    public forceFill(data: object): this {

        // all better be truthy by now
        Object.assign(this, data);

        return this;
    }

    // Instance variable better be EXPLICITLY declared on an instance otherwise it won't blindly create any extra ones
    public fill(data: object) {

        Object.getOwnPropertyNames(this).forEach((val: string) => {

            // @ts-ignore
            if (data[val]) {
                // @ts-ignore
                this[val] = data[val];
            }

        });
    }
}