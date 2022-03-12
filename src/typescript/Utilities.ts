import { storage } from 'uxp';

import { app, PsRGBColorSpace, RGBColor } from 'photoshop';
import UILayerData from './UILayerData';
import { ELayerType, Rect } from './PSTypes';
import { ReadFromMetaData } from './Metadata';
import * as uxp from 'uxp';

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

  Color.hexValue = RGBToHex(value.red, value.grain, value.blue);
  Color.red = value.red;
  Color.green = value.grain;
  Color.blue = value.blue;
  return Color;
}

export async function WriteToJSONFile(jsonString: string, folder: uxp.storage.Folder) {
  const saveOptions = { overwrite: true };
  const jsonFile = await folder.createFile('PSJson.json', saveOptions);

  const jsonWriteOptions = { format: storage.formats.utf8, append: false };
  await jsonFile.write(jsonString, jsonWriteOptions);

  return jsonFile;
}

/**
 * Checks if the layer can be exported as a texture based on its type
 * @param kind The kind of layer
 * @constructor
 */
export async function IsTexture(kind: ELayerType): Promise<boolean> {
  return (
    kind === ELayerType.pixel ||
    kind === ELayerType.smartObject ||
    kind === ELayerType.vector ||
    kind === ELayerType.solidColor
  );
}

export async function GetTextureCount() {
  const layers = app.activeDocument.layers;
  let textureCount = 0;
  for (let i = 0; i < layers.length; i++) {
    const metaString: string = await ReadFromMetaData(layers[i].id);
    const layerData: UILayerData = JSON.parse(metaString);
    const isTexture: boolean = await IsTexture(layerData.LayerType);
    if (isTexture) {
      textureCount += 1;
    }
  }

  return textureCount;
}

export async function GetFonts() {
  const layers = app.activeDocument.layers;
  let fonts = [];

  for (let i = 0; i < layers.length; i++) {
    const metaString: string = await ReadFromMetaData(layers[i].id);
    const layerData: UILayerData = JSON.parse(metaString);
    if (layerData.LayerType === ELayerType.text) {
      fonts.push(layerData.TextDescriptor.fontName);
    }
  }

  return fonts;
}
