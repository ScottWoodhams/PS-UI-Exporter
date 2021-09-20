import {
    action,
    ActionDescriptor,
    app,
    LayerDescriptor,
    PixelValue,
    TopRightBottomleft,
    Unit,
    UnitValue,
    UVRectangleDescriptor
} from "photoshop";
import {TextKeyDescriptor} from "photoshop-types/types/TextKey";
import {PsColor} from "photoshop-types/types/Color";
import {DropShadowDescriptor, FrameFXDescriptor} from "photoshop-types/types/LayerEffects";

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

export type SliceType = "Normal"| "Slice" | "Tiled"

export class UILayerData {

    //general - required
    Name: string;
    LayerType: LayerKind;
    Bounds: UVRectangleDescriptor<PixelValue>;
    HasLayerEffects: boolean;

    //Image specific
    Slices?: TopRightBottomleft;
    SliceType?: SliceType;

    //Text Specific
    TextDescriptor?: TextKeyDescriptor;

    //outline
    frameFX?: FrameFXDescriptor;
    dropShadow?: DropShadowDescriptor;

    constructor(LayerID: number) {
        this.Name = GetLayerProperty(LayerID, 'name');
        this.LayerType = GetLayerProperty(LayerID, 'layerKind');
        this.Bounds = GetLayerProperty(LayerID, 'bounds');
        this.HasLayerEffects = GetLayerProperty(LayerID, 'layerFXVisible');
    }
}



export async function CreateUILayerData(LayerID: number) : Promise<UILayerData> {
    let data: UILayerData = new UILayerData(LayerID)

    return data
}

export async function GetLayerDesc(layerID: number) {
    const result = await action.batchPlay(
        [
            {
                _obj: "get",
                //@ts-ignore
                _target: [
                    {_ref: "layer", _id: layerID},
                    //@ts-ignore
                    { _ref: "document", _id: app.activeDocument._id }
                ],
                _options: { dialogOptions: "dontDisplay"}
            }
        ],{ "synchronousExecution": false, "modalBehavior": "fail"});

    return result

}


function CreateAndRunDescriptor(layerId: number, property: string) : ActionDescriptor {
    return {
        _obj: 'get',
        //@ts-ignore
        _target: [
            {_property: property},
            {_ref: 'layer', _id: layerId}
        ],
        _options: {dialogOptions: 'dontDisplay'}
    };
}

// Text Properties

async function GetTextKey(layerId: number) : Promise<TextKeyDescriptor> {
    const t = await action.batchPlay([ CreateAndRunDescriptor(layerId, "textKey")])
    return t[0].textKey
}

async function GetTextFont(layerId: number): Promise<string> {
    const textKey = await GetTextKey(0)
    return textKey.textStyleRange[0].textStyle.fontName
}

async function GetTextSize(layerId: number): Promise<number> {
    const textKey = await GetTextKey(0)
    return textKey.textStyleRange[0].textStyle.size._value
}

async function GetTextContent(layerId: number): Promise<string> {
    const textKey = await GetTextKey(0)
    return textKey.textKey
}

async function GetTextColor(layerId: number): Promise<PsColor> {
    const textKey = await GetTextKey(0)
    return textKey.textStyleRange[0].textStyle.color
}

async function GetTextJustification(layerId: number): Promise<"left" | "center" | "right" | "justifyLeft" | "justifyCenter" | "justifyRight" | "justifyAll" | undefined> {
    const textKey = await GetTextKey(0)
    return textKey.paragraphStyleRange[0].paragraphStyle.align?._value
}

async function GetTextType(layerId: number): Promise<"box" | "paint"> {
    const textKey = await GetTextKey(0)
    return textKey.textShape[0].char._value
}


function GetLayerProperty<T extends keyof LayerDescriptor>(layerId: number,_property: string) {
    const result = action.batchPlay([
        {
            _obj: 'get',
            //@ts-ignore
            _target: [{ _property }, { _ref: 'layer', _id: layerId }],
        },
    ], { synchronousExecution: true })

    // @ts-ignore
    return result[0][_property]
}