import { RGBColor } from 'photoshop';

export type SliceType = 'None' | 'Sliced' | 'Tiled';
export type LayerType = 'None' | 'Texture' | 'Text' | 'Component';

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
