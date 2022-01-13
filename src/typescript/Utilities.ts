import { storage } from 'uxp';

import UILayerData from './UILayerData';

import { ExecuteSlice } from './SliceOperation';
import {app, ColorDescriptor, DocumentCreateOptions, Layer, LayerKindConsts, Rectangle, Document} from 'photoshop';
import { Rect } from './PSTypes';

/**
 * simplifying data for easier reading and exporting
 * @param value The rectangle to simplify
 * @constructor
 */
export function RectangleToRect(value: any) {
  let Rect: Rect = { bottom: 0, height: 0, left: 0, right: 0, top: 0, width: 0 };

  Rect.top = value.top._value;
  Rect.bottom = value.bottom._value;
  Rect.left = value.left._value;
  Rect.right = value.right._value;
  Rect.width = value.width._value;
  Rect.height = value.height._value;
  return Rect;
}

//convert red-green-blue to HEX value
//todo correct this function
export function RGBToHex(red: number, green: number, blue: number) {
  return '#' + ((1 << 24) + (red << 16) + (green << 8) + blue).toString(16).slice(1);
}

//todo correct this function
//simplifying data for easier reading and exporting
export async function ColorDescToColorObj(value: ColorDescriptor) {
  let Color = { Blue: 0, Green: 0, Hex: '', Red: 0 };

  console.log('color ' + { value });
  /*  Color.Hex = RGBToHex(value, value.grain, value.blue);
  Color.Red = value.red;
  Color.Green = value.grain;
  Color.Blue = value.blue;*/
  return value;
}

export async function WriteToJSONFile(jsonString: string, folder: storage.Folder) {
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
export async function IsTexture(kind: LayerKindConsts) {
  return kind == 'pixel' || 'smartObject' || 'solidColor';
}

/**
 * Exports a layer as a PNG file
 * @param layerData data object containing information such as layer size
 * @param layer the layer to export
 * @param folder the folder to export to
 * @constructor
 */
export async function ExportTexture(layerData: UILayerData, layer: Layer, folder: storage.Folder) {
  const options: DocumentCreateOptions = {
    typename: '',
    fill: "transparent",
    height: app.activeDocument.height,
    mode: "RGBColorMode",
    name: 'Image Export',
    resolution: app.activeDocument.resolution,
    width: app.activeDocument.width,
  };

  let exportDocument: Document = await app.createDocument(options);

  let duplicatedLayer = await layer.duplicate(exportDocument);
  await duplicatedLayer.rasterize("entire");
  await exportDocument.trim('transparent', true, true,true,true);

  if (layerData.SliceType != 'None') {
    await ExecuteSlice(layerData.Slices, exportDocument.width, exportDocument.height, exportDocument.id, 8);
  }

  let pngFile: storage.File = await folder.createFile(layerData.Name + '.png', { overwrite: true });

  const saveOptions = {
    alphaChannels: true,
    annotations: false,
    layers: false,
    embedColorProfile: false,
    spotColors: false,
  };


  // @ts-ignore
  await exportDocument.save(pngFile, saveOptions);
  await exportDocument.closeWithoutSaving();
}
