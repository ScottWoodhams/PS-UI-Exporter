import { action, app, Layer } from 'photoshop';
import { IsTexture, IsTextureLayerObjKind } from './Utilities';
import {GetMetaProperty, ReadFromMetaData} from './Metadata';
import * as PSTypes from './PSTypes';

export async function ValidateTexturesNames() {
  let textureLayerNames = [];
  await Promise.all(
    app.activeDocument.layers.map(async (layer: Layer) => {
      if (await IsTextureLayerObjKind(layer.kind)) {
        textureLayerNames.push(layer.name);
      }
    })
  );

  function findDuplicates(arr): Array<string> {
    return arr.filter((item, index) => arr.indexOf(item) != index);
  }

  return findDuplicates(textureLayerNames).length > 0;
}

export async function ValidateNoEmptyLayers() {
  let emptyLayers = [];
  await Promise.all(
    app.activeDocument.layers.map(async (layer: Layer) => {
      if (layer.bounds.width === 0 && layer.bounds.width === 0) {
        emptyLayers.push(layer);
      }
    })
  );
  return emptyLayers.length > 0;
}

export async function ValidateSliceValues() {
  let invalidSlices = [];
  await Promise.all(
    app.activeDocument.layers.map(async (layer: Layer) => {
      let slices = await GetMetaProperty(layer.id, 'Slices');
      if (typeof slices === 'string') {
        let slicesObj: PSTypes.Slices = JSON.parse(slices);

        if (slicesObj.left === 0 && slicesObj.right === 0 && slicesObj.top === 0 && slicesObj.bottom === 0) {
          invalidSlices.push(layer);
        }
      }
    })
  );

  return invalidSlices.length > 0;
}

export async function ValidateTexts() {
  let emptyTextLayers = [];
  await Promise.all(
    app.activeDocument.layers.map(async (layer: Layer) => {
      if (layer.kind === 'text') {
        const result = await action.batchPlay(
          [
            {
              _obj: 'get',
              _target: [
                { _ref: 'layer', _id: layer.id },
                { _ref: 'document', _enum: 'ordinal' },
              ],
              _options: { dialogOptions: 'dontDisplay' },
            },
          ],
          {
            synchronousExecution: true,
          }
        )[0].textKey.textKey;

        if (result === '' || result === undefined) {
          emptyTextLayers.push(layer);
        }
      }
    })
  );

  return emptyTextLayers.length > 0;
}

export async function ValidateMeta() {
  let metaLayers = [];
  // todo check if there are 1 or more metadata layers available for export
  await Promise.all(
      app.activeDocument.layers.map(async (layer: Layer) => {
        let meta = await ReadFromMetaData(layer.id);
        if(meta !== undefined){
          metaLayers.push(meta);
        }
      }));

  return metaLayers.length;
}
