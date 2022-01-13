import { action, app } from "photoshop";
import UILayerData, { LayerDataInit } from "./UILayerData";

export async function InitLayers() {
  for (const layer of app.activeDocument.layers) {
    const id = layer.id;
    const layerData: UILayerData = new UILayerData(layer);
    await LayerDataInit(layerData, id);
    await WriteToMetaData(id, layerData);
  }
}

export async function WriteToMetaData(LayerId: number, data: UILayerData) {
  const content = JSON.stringify(data);

  const command = {
    _obj: 'set',
    _target: [
      { _ref: "property", _property: "XMPMetadataAsUTF8" }
      , { _ref: "layer", _id: LayerId }
    ],
    to: {
      _obj: 'layer',
      XMPMetadataAsUTF8: content,
    },
    options: { failOnMissingProperty: true, failOnMissingElement: true },
  }

  await action.batchPlay([command], {});

}

export async function ReadFromMetaData(LayerId: number) {
  const result = await action.batchPlay(
    [
      {
        _obj: 'get',
        _target: [{ _property: 'XMPMetadataAsUTF8' }, { _ref: 'layer', _id: LayerId }],
        _options: { dialogOptions: 'dontDisplay' },
      },
    ],
    {
      modalBehavior: 'fail',
    }
  );

  return result[0].XMPMetadataAsUTF8;
}

export async function UpdateMetaProperty(LayerID: number, property: string, value: unknown) {
  const meta: string = await ReadFromMetaData(LayerID);
  const metaObj: UILayerData = JSON.parse(meta);
  metaObj[property] = value;
  await WriteToMetaData(LayerID, metaObj);
}

export async function GetMetaProperty(LayerID: number, property: string): Promise<any> {
  const meta: string = await ReadFromMetaData(LayerID);
  const metaObj: UILayerData = JSON.parse(meta);
  return metaObj[property];
}