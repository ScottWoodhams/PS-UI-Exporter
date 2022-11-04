import {Layer} from "photoshop/dom/Layer";import { Document } from "photoshop/dom/Document";

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