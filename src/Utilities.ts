import {Layer} from "photoshop/dom/Layer";import { Document } from "photoshop/dom/Document";
import { LayerKind } from "photoshop/dom/Constants";
import {Bounds} from "photoshop/dom/objects/Bounds";
import {Vector2} from "./classes/Vector2";
import {ExportType} from "./constants/export-type";

export function walkActionThroughLayers(parentLayer: Layer | Document, action: (Layer: Layer) => void) {
  let curLayer: Layer;

  for (let i = 0; i < parentLayer.layers.length; i++) {
    curLayer = parentLayer.layers[i];
    action(curLayer);
    if (curLayer.kind === 'group') {
      walkActionThroughLayers(curLayer, action);
    }
  }
}

export function GetExportType(layer: Layer): ExportType {

  switch (layer.kind) {
    case LayerKind.BLACKANDWHITE:       return ExportType.None;
    case LayerKind.BRIGHTNESSCONTRAST:  return ExportType.None;
    case LayerKind.CHANNELMIXER:        return ExportType.None;
    case LayerKind.COLORBALANCE:        return ExportType.None;
    case LayerKind.CURVES:              return ExportType.None;
    case LayerKind.EXPOSURE:            return ExportType.None;
    case LayerKind.GRADIENTFILL:        return ExportType.Image;
    case LayerKind.GRADIENTMAP:         return ExportType.None;
    case LayerKind.HUESATURATION:       return ExportType.None;
    case LayerKind.INVERSION:           return ExportType.None;
    case LayerKind.LEVELS:              return ExportType.None;
    case LayerKind.NORMAL:              return ExportType.Image;
    case LayerKind.PATTERNFILL:         return ExportType.Image;
    case LayerKind.PHOTOFILTER:         return ExportType.None;
    case LayerKind.POSTERIZE:           return ExportType.None;
    case LayerKind.SELECTIVECOLOR:      return ExportType.None;
    case LayerKind.SMARTOBJECT:         return ExportType.Image;
    case LayerKind.SOLIDFILL:           return ExportType.Image;
    case LayerKind.TEXT:                return ExportType.Text;
    case LayerKind.THRESHOLD:           return ExportType.None;
    case LayerKind.LAYER3D:             return ExportType.None;
    case LayerKind.VIBRANCE:            return ExportType.None;
    case LayerKind.VIDEO:               return ExportType.None;
    case LayerKind.GROUP:               return ExportType.Component;
    case LayerKind.COLORLOOKUP:         return ExportType.None;
    default:
      return ExportType.None;
  }
}

export function GetLayerPosition(layer: Layer): Vector2 {
  let bounds: Bounds =  layer.bounds;
  let xPos: number = (bounds.right + bounds.left) * 0.5;
  let yPos: number = (bounds.bottom + bounds.top) * 0.5;

  return new Vector2(xPos, yPos);
}

export function GetLayerSize(layer: Layer): Vector2 {
  let bounds: Bounds =  layer.bounds;
  let width: number = (bounds.right - bounds.left);
  let height: number = (bounds.bottom - bounds.top);
  return new Vector2(width, height);

}