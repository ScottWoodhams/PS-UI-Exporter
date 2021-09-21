import {
    action, PixelValue, RGBColorSpace,
    UVRectangleDescriptor
} from "photoshop";
import {UILayerData} from "./UILayerData";

export enum LayerKind {
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
    groupEnd = 13
}



export async function WriteToMetaData(LayerId: number, data: UILayerData) {

    let content = JSON.stringify(data);

    await action.batchPlay([{
        _obj: 'set',
        // @ts-ignore
        _target: [
            {_ref: 'property', _property: 'XMPMetadataAsUTF8'},
            {_ref: 'layer', _id: LayerId}
        ],
        to: {
            _obj: 'layer',
            XMPMetadataAsUTF8: content
        }
    }], {})
}

export async function ReadFromMetaData(LayerId: number) {
    const result = await action.batchPlay(
        [
            {
                "_obj": "get",
                // @ts-ignore
                "_target": [
                    {_property: "metadata"},
                    {_ref: "layer", _id: LayerId}
                ],
                "_options": {"dialogOptions": "dontDisplay"}
            }
        ], {
            "synchronousExecution": false,
            "modalBehavior": "fail"
        });

    return result[0].metadata.layerXMP;
}

export async function UpdateMetaProperty(LayerID: number, property: string, value:any) {
    let meta: string = await ReadFromMetaData(LayerID);
    let metaObj: UILayerData = JSON.parse(meta);
    // @ts-ignore
    metaObj[property] = value
    await WriteToMetaData(LayerID, metaObj);
}