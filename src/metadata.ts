import {action, app, core} from 'photoshop';
import { Slices } from './slices';

export class Metadata {

  ComponentName: string;
  Slices: Slices;

  constructor(){
    this.ComponentName = "Not Component"
    this.Slices = Slices.Zero;
  }

}

export async function WriteToMetaData(LayerId: number, data: Metadata)
{
  await core.executeAsModal(() => Internal_WriteToMetaData(LayerId, data), { commandName: '' })
}

export async function ReadMetaData(LayerId: number): Promise<string>
{
  return Internal_ReadMetaData(LayerId);
}

async function Internal_WriteToMetaData(LayerId: number, data: Metadata) {


  const content = JSON.stringify(data);

  const command = {
    _obj: 'set',
    _target: [
      { _ref: 'property', _property: 'XMPMetadataAsUTF8' },
      { _ref: 'layer', _id: LayerId },
      { _ref: "document", _id: app.activeDocument.id }
    ],
    to: {
      _obj: 'layer',
      XMPMetadataAsUTF8: content,
    },
    options: { failOnMissingProperty: true, failOnMissingElement: true },
  };

  await action.batchPlay([command], {});
}

async function Internal_ReadMetaData(LayerId: number): Promise<string> {

  try{
    const result = await action.batchPlay(
      [
        {
          _obj: 'get',
          _target: [
            { _property: 'XMPMetadataAsUTF8' },
            { _ref: 'layer', _id: LayerId },
            { _ref: "document", _id: app.activeDocument.id }
          ],
          _options: { dialogOptions: 'dontDisplay' },
        },
      ],
      {
        modalBehavior: 'execute',
      }
    );
    console.log(result[0])
    return result[0].XMPMetadataAsUTF8;
  } catch (e) {
    console.log(e)
  }

}



// export async function UpdateMetaProperty(LayerID: number, property: string, value: unknown) {
//   const meta = await ReadFromMetaData(LayerID);
//   if(meta === null ){
//     await WriteToMetaData(LayerID, new UILayerData())
//   }
//   const metaObj: UILayerData = JSON.parse(meta);
//   //metaObj[property] = value;
//   await core.executeAsModal(() => WriteToMetaData(LayerID, metaObj), { commandName: '' });
// }
//
// export async function GetMetaProperty(LayerID: number, property: string): Promise<unknown> {
//   const meta: string = await ReadFromMetaData(LayerID);
//   const metaObj: UILayerData = JSON.parse(meta);
//   return metaObj[property];
// }

// export async function SetToComponent(LayerID: number, ComponentID: string) {
//   await UpdateMetaProperty(LayerID, 'Component', ComponentID);
//   await UpdateMetaProperty(LayerID, 'IsComponent', true);
// }

// async function ClearMetaData(LayerId: number) {
//   const command = {
//     _obj: 'set',
//     _target: [
//       { _ref: 'property', _property: 'XMPMetadataAsUTF8' },
//       { _ref: 'layer', _id: LayerId },
//     ],
//     to: {
//       _obj: 'layer',
//       XMPMetadataAsUTF8: '',
//     },
//     options: { failOnMissingProperty: true, failOnMissingElement: true },
//   };
//
//   await action.batchPlay([command], {});
// }


