export class RawExpression {

    public expr: string;

    constructor(expr: string) {
        this.expr = expr;
    }

    static createFrom(expr: string): RawExpression {
        return new this(expr);
    }

    static now() {
        return this.createFrom('NOW()');
    }
}