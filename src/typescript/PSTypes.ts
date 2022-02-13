import {Bounds, RGBColor} from 'photoshop';

export enum ELayerType {
  any = 0,
  pixel = 1,
  adjustment = 2,
  text = 3,
  vector = 4,
  smartObject = 5,
  video = 6,
  group = 7,
  threeD = 8,
  gradient = 9,
  pattern = 10,
  solidColor = 11,
  background = 12,
  groupEnd = 13,
}

export type SliceType = 'None' | 'Sliced' | 'Tiled';

export type RectProps = { rect: Bounds; slices: Slices };

export interface FrameFXDescriptor {
  size: number;
  color: RGBColor;
}

export interface DropShadowDescriptor {
  angle: number;
  distance: number;
  color: RGBColor;
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
  type: string;
  color: RGBColor;
}

export interface Color {
  Hex: string;
  Red: number;
  Green: number;
  Blue: number;
}
