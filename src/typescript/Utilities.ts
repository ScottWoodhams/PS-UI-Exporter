import { Bounds } from 'photoshop/dom/objects/Bounds';
import { Color, Rect } from './PSTypes';
import { ColorDescriptor, RGBColorDescriptor } from 'photoshop/util/colorTypes';
import { storage } from 'uxp';
import { action, App, core, Document } from 'photoshop';
import { DocumentCreateOptions } from 'photoshop/dom/objects/CreateOptions';
import { DocumentFill, NewDocumentMode, RasterizeType } from 'photoshop/dom/Constants';
import UILayerData from './UILayerData';
import { Layer } from 'photoshop/dom/Layer';
import { InitLayers } from './Metadata';
import {ExecuteSlice} from "./SliceOperation";

const app: App = require('photoshop').app;

//use this instead of Photoshop "layerKind" type as it does not match with batchplay layerKind getter
export enum ADLayerKind {
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

//simplifying data for easier reading and exporting
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

export async function IsTexture(id: ADLayerKind) {
  return id == ADLayerKind.pixel || id == 4 || id == 5 || id == 9 || id == 11;
}

export async function TrimDocument() {
  await action.batchPlay(
    [
      {
        _obj: 'trim',
        trimBasedOn: { _enum: 'trimBasedOn', _value: 'transparency' },
        top: true,
        bottom: true,
        left: true,
        right: true,
        _isCommand: true,
        _options: { dialogOptions: 'dontDisplay' },
      },
    ],
    {}
  );
}

export async function ExportTexture(layerData: UILayerData, layer: Layer, folder: storage.Folder) {
  const options: DocumentCreateOptions = {
    typename: '',
    fill: DocumentFill.TRANSPARENT,
    height: app.activeDocument.height,
    mode: NewDocumentMode.RGB,
    name: 'Image Export',
    resolution: app.activeDocument.resolution,
    width: app.activeDocument.width,
  };

  let exportDocument: Document = await app.createDocument(options);

  let duplicatedLayer = await layer.duplicate(exportDocument);
  await duplicatedLayer.rasterize(RasterizeType.ENTIRELAYER);
  core.executeAsModal(TrimDocument, { commandName: 'Trimming document' });

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

  await exportDocument.save(pngFile, saveOptions);
  await exportDocument.closeWithoutSaving();
}

//--SLICING--//
