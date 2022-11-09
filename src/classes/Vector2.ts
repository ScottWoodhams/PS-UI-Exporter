
export class Vector2 {

    X: number;
    Y: number;

    constructor(x: number, y: number) {
        this.X = x;
        this.Y = y;
    }

    Print() {
        return `x: ${this.X} | y: ${this.Y} `;
    }

    static get Zero(): Vector2{
        return new Vector2(0,0);
    }
}