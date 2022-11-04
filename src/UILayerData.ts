export class Slices {

  top: number;
  right: number;
  bottom: number;
  left: number;


  constructor(top: number, right: number, bottom: number, left: number) {
    this.top = top;
    this.right = right;
    this.bottom = bottom;
    this.left = left;
  }

   Print() {
    return `Top: ${this.top}, Right: ${this.right}, Bottom: ${this.bottom}, Left: ${this.left}`;
  }

  static Zero(): Slices {
    return new Slices(0,0,0,0);
  }


}


export class UILayerData {

  ComponentName: string;
  Slices: Slices;

}