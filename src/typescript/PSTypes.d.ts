import { ColorDescriptor } from "photoshop/util/colorTypes";
import { Bounds } from "photoshop/dom/objects/Bounds";
import { ColorModel } from "photoshop/dom/Constants";


export type SliceType = 'None' | 'Sliced' | 'Tiled';
export type RectProps = { rect: Bounds; slices: Slices };



export interface FrameFXDescriptor {

}

export interface DropShadowDescriptor {

}

export interface Rect {
  top: number;
  left: number;
  bottom: number;
  right: number;
  width: number;
  height: number;
}

export interface Slices {
  top: number;
  left: number;
  bottom: number;
  right: number;
}

export interface TextDescriptor {
  fontName: string;
  size: number;
  textKey: string;
  type: any;
  color: Color;
}

export interface Color {
  Hex: string;
  Red: number;
  Green: number;
  Blue: number;
}

