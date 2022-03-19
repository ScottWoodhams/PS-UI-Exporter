import { action, app, Layer } from 'photoshop';
import { IsTextureLayerObjKind } from './Utilities';
import { GetMetaProperty, ReadFromMetaData } from './Metadata';
import * as PSTypes from './PSTypes';

export interface ValidationData {
  duplicateTextureNames: number;
  emptyLayers: number;
  invalidSlices: number;
  invalidTextLayers: number;
}

export async function ValidationChecks(): Promise<ValidationData> {
  let data: ValidationData;
  const textureLayerNames = [];
  await Promise.all(
    app.activeDocument.layers.map(async (layer: Layer) => {
      const metadata = ReadFromMetaData(layer.id);

      if (metadata !== undefined) {
        if (await IsTextureLayerObjKind(layer.kind)) {
          textureLayerNames.push(layer.name);

          const slices = await GetMetaProperty(layer.id, 'Slices');
          if (typeof slices === 'string') {
            const slicesObj: PSTypes.Slices = JSON.parse(slices);

            if (slicesObj.left === 0 && slicesObj.right === 0 && slicesObj.top === 0 && slicesObj.bottom === 0) {
              data.invalidSlices++;
            }
          }
        }
        if (layer.bounds.width === 0 && layer.bounds.width === 0) {
          data.emptyLayers++;
        }

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
            data.invalidTextLayers++;
          }
        }
      }
    })
  );

  function findDuplicates(arr): Array<string> {
    return arr.filter((item, index) => arr.indexOf(item) !== index);
  }

  data.duplicateTextureNames = findDuplicates(textureLayerNames).length;

  return data;
}
