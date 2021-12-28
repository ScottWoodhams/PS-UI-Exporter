import { Bounds } from 'photoshop/dom/objects/Bounds';
import { Color, Rect } from './PSTypes';
import { ColorDescriptor, RGBColorDescriptor } from 'photoshop/util/colorTypes';
import { storage } from 'uxp';

//use this instead of Photoshop "layerKind" type as it does not match with batchplay layerKind get
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
export function RGBToHex(red: number, green: number, blue: number) {
  return '#' + ((1 << 24) + (red << 16) + (green << 8) + blue).toString(16).slice(1);
}

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

export async function ExportTexture() {

  //todo create export doc

  //todo duplicate image layer to the export doc

  //todo if layer is sliced or tiled -> perform slice operation

  //todo create file options

  //todo create file in folder

  //todo create save options

  //todo save exported document to the created file

  //todo close the export document
}