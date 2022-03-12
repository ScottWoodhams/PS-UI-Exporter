import { action, app, core, ExecuteAsModalOptions, ExecutionContext, Layer } from 'photoshop';
import UILayerData, { LayerDataInit } from './UILayerData';
import { Log, LogLevel } from './Logger';

export async function WriteToMetaData(LayerId: number, data: UILayerData) {
  const content = JSON.stringify(data);

  const command = {
    _obj: 'set',
    _target: [
      { _ref: 'property', _property: 'XMPMetadataAsUTF8' },
      { _ref: 'layer', _id: LayerId },
    ],
    to: {
      _obj: 'layer',
      XMPMetadataAsUTF8: content,
    },
    options: { failOnMissingProperty: true, failOnMissingElement: true },
  };

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
      modalBehavior: 'execute',
    }
  );

  return result[0].XMPMetadataAsUTF8;
}

export async function InitLayers() {
  const totalLayers: number = app.activeDocument.layers.length;
  let layerCount = 0;
  await Promise.all(
    app.activeDocument.layers.map(async (layer: Layer) => {
      layerCount += 1;
      const meta = await ReadFromMetaData(layer.id);
      if (meta === undefined) {
        const layerData: UILayerData = await LayerDataInit(layer.id);
        await WriteToMetaData(layer.id, layerData);
      }
    })
  );

  await Log(LogLevel.Info, `Total Layers: ${totalLayers} Processed: ${layerCount}`);
}

export async function UpdateMetaProperty(LayerID: number, property: string, value: unknown) {
  await Log(LogLevel.Info, `Updating Meta Property: ${property} New Value: ${value}`);
  const meta = await ReadFromMetaData(LayerID);
  const metaObj: UILayerData = JSON.parse(meta);
  metaObj[property] = value;
  await core.executeAsModal(() => WriteToMetaData(LayerID, metaObj), { commandName: '' });
}

export async function GetMetaProperty(LayerID: number, property: string): Promise<unknown> {
  await Log(LogLevel.Info, `Getting Meta Property: ${property}`);
  const meta: string = await ReadFromMetaData(LayerID);
  const metaObj: UILayerData = JSON.parse(meta);
  return metaObj[property];
}

export async function SetToComponent(LayerID: number, ComponentID: string) {
  await UpdateMetaProperty(LayerID, 'Component', ComponentID);
  await UpdateMetaProperty(LayerID, 'IsComponent', true);
}
