import {EntityModel} from "./EntityModel";

export class Setting extends EntityModel {

    public id: number = 0;
    public name: string = "";
    public value: string = "";
    public meta_json: string = "";
}