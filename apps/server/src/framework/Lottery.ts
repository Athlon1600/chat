import {RandomUtils} from "../util/RandomUtils";

export class Lottery {

    private readonly a: number;
    private readonly b: number;

    constructor(a: number, b: number = 100) {
        this.a = a;
        this.b = b;
    }

    public draw(): boolean {
        return RandomUtils.randInt(0, this.b) <= this.a;
    }
}