import {SliceType} from "../constants/slice-type";

export class Slices {

  top: number;
  right: number;
  bottom: number;
  left: number;
  type: SliceType;

  constructor(top: number, right: number, bottom: number, left: number, type: SliceType = SliceType.Sliced) {
    this.top = top;
    this.right = right;
    this.bottom = bottom;
    this.left = left;
    this.type = type;
  }

  Print() {
    return `Top: ${this.top}, Right: ${this.right}, Bottom: ${this.bottom}, Left: ${this.left}`;

  }

  static get Zero(): Slices {
    return new Slices(0,0,0,0);
  }
}

