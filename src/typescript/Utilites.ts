import { app } from "photoshop";

import { LayerKind } from "photoshop/dom/Constants";

export enum supportedExports {
  NONE = "None",
  IMAGE = "Image",
  TEXT = "Text",
  "WIDGET" = "Widget"
}

export function GetExportedLayerType(kind: LayerKind) {
  console.log(app.activeDocument.activeLayers[0]);
  switch (kind) {
    case LayerKind.BLACKANDWHITE:
      return supportedExports.NONE;

    case LayerKind.BRIGHTNESSCONTRAST:
      return supportedExports.NONE;
    case LayerKind.CHANNELMIXER:
      return supportedExports.NONE;
    case LayerKind.COLORBALANCE:
      return supportedExports.NONE;
    case LayerKind.CURVES:
      return supportedExports.NONE;
    case LayerKind.EXPOSURE:
      return supportedExports.NONE;
    case LayerKind.GRADIENTFILL:
      return supportedExports.IMAGE;
    case LayerKind.GRADIENTMAP:
      return supportedExports.IMAGE;
    case LayerKind.HUESATURATION:
      return supportedExports.NONE;
    case LayerKind.INVERSION:
      return supportedExports.NONE;
    case LayerKind.LEVELS:
      return supportedExports.NONE;
    case LayerKind.NORMAL:
      return supportedExports.IMAGE;
    case LayerKind.PATTERNFILL:
      return supportedExports.IMAGE;
    case LayerKind.PHOTOFILTER:
      return supportedExports.NONE;
    case LayerKind.POSTERIZE:
      return supportedExports.NONE;
    case LayerKind.SELECTIVECOLOR:
      return supportedExports.NONE;
    case LayerKind.SMARTOBJECT:
      return supportedExports.IMAGE;
    case LayerKind.SOLIDFILL:
      return supportedExports.IMAGE;
    case LayerKind.TEXT:
      return supportedExports.TEXT;
    case LayerKind.THRESHOLD:
      return supportedExports.NONE;
    case LayerKind.LAYER3D:
      return supportedExports.NONE;
    case LayerKind.VIBRANCE:
      return supportedExports.NONE;
    case LayerKind.VIDEO:
      return supportedExports.NONE;
    case LayerKind.GROUP:
      return supportedExports.NONE;
    case LayerKind.COLORLOOKUP:
      return supportedExports.NONE;
    default:
      return supportedExports.NONE;
  }
}
