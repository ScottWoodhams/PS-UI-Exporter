import {Layer} from "photoshop/dom/Layer";import { Document } from "photoshop/dom/Document";
import { LayerKind } from "photoshop/dom/Constants";

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

export function IsTexture(layer: Layer): boolean {

  switch (layer.kind) {
    case LayerKind.BLACKANDWHITE:
    case LayerKind.BRIGHTNESSCONTRAST:
    case LayerKind.CHANNELMIXER:
    case LayerKind.COLORBALANCE:
    case LayerKind.CURVES:
    case LayerKind.EXPOSURE:
      return false;
    case LayerKind.GRADIENTFILL:
      return true;
    case LayerKind.GRADIENTMAP:
    case LayerKind.HUESATURATION:
    case LayerKind.INVERSION:
    case LayerKind.LEVELS:
      return false;
    case LayerKind.NORMAL:
      return true;
    case LayerKind.PATTERNFILL:
      return true;
    case LayerKind.PHOTOFILTER:
    case LayerKind.POSTERIZE:
    case LayerKind.SELECTIVECOLOR:
    case LayerKind.SMARTOBJECT:
      return true;
    case LayerKind.SOLIDFILL:
      return true;
    case LayerKind.TEXT:
      return false;
    case LayerKind.THRESHOLD:
    case LayerKind.LAYER3D:
    case LayerKind.VIBRANCE:
    case LayerKind.VIDEO:
    case LayerKind.GROUP:
    case LayerKind.COLORLOOKUP:
    default:
      return false;
  }
}