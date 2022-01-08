import { Bounds } from "photoshop/dom/objects/Bounds";

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

//Due to issues with importing enum from .d.ts files we declared enum types here instead


export const enum RasterizeType {
  ENTIRELAYER = "entire",
  FILLCONTENT = "content",
  LAYERCLIPPINGPATH = "clippingPath",
  LINKEDLAYERS = "linked",
  SHAPE = "shape",
  TEXTCONTENTS = "type",
  VECTORMASK = "vectorMask",
  PLACED = "placed",
  VIDEO = "video",
  LAYERSTYLE = "layerStyle"
}

export const enum TrimType {
  BOTTOMRIGHT = "bottom-right",
  TOPLEFT = "top-left",
  TRANSPARENT = "transparent"
}

export enum NewDocumentMode {
  BITMAP = "bitmapMode",
  GRAYSCALE = "grayscaleMode",
  RGB = "RGBColorMode",
  CMYK = "CMYKColorMode",
  LAB = "labColorMode"
}

export enum DocumentFill {
  WHITE = "white",
  BLACK = "black",
  BACKGROUNDCOLOR = "backgroundColor",
  TRANSPARENT = "transparent",
  COLOR = "color"
}