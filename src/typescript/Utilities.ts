import { storage } from 'uxp';
import { Document, Layer, LayerKindConsts, PsRGBColorSpace, RGBColor } from 'photoshop';

import * as uxp from 'uxp';
import { Rect } from './PSTypes';


/**
 * simplifying data for easier reading and exporting
 * @param value The rectangle to simplify
 * @constructor
 */
export function RectangleToRect(value: any) {
  const Rect: Rect = { bottom: 0, height: 0, left: 0, right: 0, top: 0, width: 0 };

  Rect.top = value.top._value;
  Rect.bottom = value.bottom._value;
  Rect.left = value.left._value;
  Rect.right = value.right._value;
  Rect.width = value.width._value;
  Rect.height = value.height._value;
  return Rect;
}

// convert red-green-blue to HEX value
export function RGBToHex(red: number, green: number, blue: number) {
  return `#${((1 << 24) + (red << 16) + (green << 8) + blue).toString(16).slice(1)}`;
}

export const EmptyColor: RGBColor = {
  blue: -1,
  green: -1,
  red: -1,
  hexValue: 'undefined',
  typename: 'rgb',
};

// simplifying data for easier reading and exporting
export async function ColorDescToColorObj(value: PsRGBColorSpace) {
  const Color: RGBColor = {
    blue: 0,
    green: 0,
    red: 0,
    hexValue: '',
    typename: 'rgb',
  };

  Color.red = Math.round(value.red);
  Color.green = Math.round(value.grain);
  Color.blue = Math.round(value.blue);
  Color.hexValue = RGBToHex(Color.red, Color.green, Color.blue);

  return Color;
}



export async function IsTextureLayerObjKind(kind: LayerKindConsts): Promise<boolean> {
  return kind === 'pixel' || kind === 'smartObject' || kind === 'solidColor';
}

export function walkActionThroughLayers(parentLayer: Layer | Document, action: (Layer) => void) {
  let curLayer: Layer;

  for (let i = 0; i < parentLayer.layers.length; i++) {
    curLayer = parentLayer.layers[i];
    action(curLayer);
    if (curLayer.kind === 'group') {
      walkActionThroughLayers(curLayer, action);
    }
  }
}
