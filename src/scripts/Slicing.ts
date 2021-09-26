import {action, app, Document, Layer, Orientation, TopRightBottomleft} from 'photoshop'
import {UpdateMetaProperty} from "./Metadata";
import {SliceType} from "./UILayerData";

//----- Setup -----//

export async function Setup() {

    const activeLayer: Layer = app.activeDocument.activeLayers[0];

    let sliceDoc: Document = <Document>await app.createDocument({
        width: app.activeDocument.width,
        height: app.activeDocument.height,
        resolution: app.activeDocument.resolution,
        // @ts-ignore
        mode: 'RGBColorMode',
        name: 'SlicingDoc',
        fill: 'transparent'

    });

    let sliceLayer: Layer = await activeLayer.duplicate(sliceDoc)

    // @ts-ignore
    await Rasterize(sliceLayer._id);

    await TrimDocument();
    // @ts-ignore
    const id: number = sliceDoc._id

    await CreateGuide(id, 0, Orientation.horizontal);
    await CreateGuide(id, 0, Orientation.vertical);
    await CreateGuide(id, sliceDoc.height, Orientation.horizontal);
    await CreateGuide(id, sliceDoc.width, Orientation.vertical);

}

export enum Anchor
{
    AnchorN = 'QCSSide0',
    AnchorW = 'QCSSide3',
    AnchorNW = 'QCSCorner0'
}

export class Rect {
    Top: number;
    Left: number;
    Bottom: number;
    Right: number;
    constructor(Top: number, Left: number, Bottom: number, Right: number) {
        this.Top = Top;
        this.Left = Left;
        this.Bottom = Bottom;
        this.Right = Right;}
}

export class Translation {
    Width: number = 0
    Height: number = 0
    XDelta: number = 0
    YDelta: number = 0
    Anchor: Anchor = Anchor.AnchorN

    constructor(Width: number, Height:number, XDelta: number, YDelta: number, Anchor: Anchor) {
        this.Width = Width
        this.Height = Height;
        this.XDelta = XDelta;
        this.YDelta = YDelta;
        this.Anchor = Anchor;
    }
}

interface PercentDelta  {
    Width: number
    Height: number
}

//----- Data handling -----//
export async function ApplyToLayerData() {
    // @ts-ignore
    const guides: TopRightBottomleft = await ReadGuides(app.activeDocument._id)
    app.activeDocument.closeWithoutSaving()

    //@ts-ignore
    await UpdateMetaProperty( app.activeDocument.activeLayers[0]._id, 'Slices', guides)

    //@ts-ignore
    await UpdateMetaProperty( app.activeDocument.activeLayers[0]._id, 'SliceType', document.getElementById('sliceOptions').value)
}

//----- Slicing Execution -----//
export function nearestPowerOf2(n: number) {
    return 1 << 31 - Math.clz32(n);
}

export async function CalculatePowerOfSize(documentID: number)
{
    const guides: TopRightBottomleft = await ReadGuides(documentID)
    const widthDelta =  guides.right - guides.left
    const heightDelta =  guides.bottom - guides.top

    let newWidth = nearestPowerOf2(widthDelta)
    let newHeight = nearestPowerOf2(heightDelta)

    return { newWidth, newHeight }
}

export async function ReadGuides(documentID: number): Promise<TopRightBottomleft> {
    let Top: number = Math.ceil(await GetGuide(documentID, 1));
    let Left: number = Math.ceil(await GetGuide(documentID, 2));
    let Bottom: number = Math.ceil(await GetGuide(documentID, 3));
    let Right: number = Math.ceil(await GetGuide(documentID, 4));
    return {top: Top, right: Right, bottom: Bottom, left: Left}
}

export async function ExecuteSlice(Slices: TopRightBottomleft, CanvasWidth: number, CanvasHeight: number, DocID: number, CenterPixelSize: number, po2: boolean) {
    const ZO = 0
    const ST = Slices.top
    const SL = Slices.left
    const SR = Slices.right
    const SB = Slices.bottom
    const CH = CanvasHeight
    const CW = CanvasWidth
    let ScaleWidth = CenterPixelSize
    let ScaleHeight = CenterPixelSize

    console.table({ST, SL, SR, SB, CH, CW, ScaleWidth,ScaleHeight})

    if(po2) {
        let newSize = await CalculatePowerOfSize(DocID)
        ScaleWidth = CW / newSize.newWidth
        ScaleHeight = CW / newSize.newHeight
    }

    const NN = new Rect(ZO, SL, ST, SR)
    const WW = new Rect(ST, ZO, SB, SL)
    const SW = new Rect(SB, ZO, CH, SL)
    const SS = new Rect(SB, SL, CH, SR)
    const SE = new Rect(SB, SR, CH, CW)
    const EE = new Rect(ST, SR, SB, CW)
    const NE = new Rect(ZO, SR, ST, CW)
    const CB = new Rect(ST, SL, SB, SR)

    const NNPercent : PercentDelta = await GetPercentDelta(CenterPixelSize, NN)
    const NTranslation = new Translation(NNPercent.Width, 100, 0, 0, Anchor.AnchorW);

    const WWPercent : PercentDelta = await GetPercentDelta(CenterPixelSize, WW)
    const WTranslation = new Translation(100, WWPercent.Height, 0, 0, Anchor.AnchorN);

    const CPercent : PercentDelta = await GetPercentDelta(CenterPixelSize, CB)
    const CTranslation = new Translation(CPercent.Width, CPercent.Height, 0, 0, Anchor.AnchorNW)

    await SelectAndTranslate(NN, NTranslation, DocID)
    await SelectAndTranslate(WW, WTranslation, DocID)
    await SelectAndTranslate(CB, CTranslation, DocID)

    const CenterWidth = SR - SL
    const CenterHeight = SB - ST

    const XMove = -(CenterWidth - CenterPixelSize)
    const YMove = -(CenterHeight - CenterPixelSize)

    const EPercent : PercentDelta = await GetPercentDelta(CenterPixelSize, EE)
    const ETranslation = new Translation(100, EPercent.Height, XMove, 0, Anchor.AnchorNW)
    const SPercent : PercentDelta = await GetPercentDelta(CenterPixelSize, EE)
    const STranslation = new Translation(SPercent.Width, 100, 0, YMove, Anchor.AnchorNW)

    const NETranslation = new Translation(100, 100, XMove,  0, Anchor.AnchorW)
    const SWTranslation = new Translation(100, 100, 0, YMove, Anchor.AnchorN)
    const SETranslation = new Translation(100, 100, XMove, YMove, Anchor.AnchorNW)

    await SelectAndTranslate(EE, ETranslation, DocID)
    await SelectAndTranslate(SS, STranslation, DocID)
    await SelectAndTranslate(NE, NETranslation, DocID)
    await SelectAndTranslate(SW, SWTranslation, DocID)
    await SelectAndTranslate(SE, SETranslation, DocID)
    await TrimDocument()

}


async function GetPercentDelta(CenterPixelSize: number, Rect: Rect) : Promise<PercentDelta> {
    const widthPercentDelta = (CenterPixelSize / (Rect.Right - Rect.Left)) * 100
    const heightPercentDelta = (CenterPixelSize / (Rect.Bottom - Rect.Top)) * 100
    return { Width: widthPercentDelta, Height: heightPercentDelta }
}

async function SelectAndTranslate (Bounds: Rect, Translation: Translation, DocID: number) {
    await Select(Bounds)
    await TranslateSelection(Translation)
    await Deselect(DocID)
}

//----- Batchplay functions -----//

export async function Rasterize(id: number) {
    try {
        await action.batchPlay([
            {
                _obj: 'rasterizeLayer',
                // @ts-ignore
                _target: [{_ref: 'layer', _id: id}],
                what: {_enum: 'rasterizeItem', _value: 'layerStyle'},
                _isCommand: true,
                _options: {dialogOptions: 'dontDisplay'}
            }
        ], {synchronousExecution: false, modalBehavior: 'fail'})
    } catch (e) {
        console.log(e)
    }
}

export async function TrimDocument() {
    await action.batchPlay([
            // @ts-ignore
            {
                _obj: 'trim',
                trimBasedOn: { _enum: 'trimBasedOn', _value: 'transparency' },
                top: true,
                bottom: true,
                left: true,
                right: true,
                _isCommand: true,
                _options: { dialogOptions: 'dontDisplay' }
            }
        ],
        { synchronousExecution: false, modalBehavior: 'fail' })
}


export async function CreateGuide (documentID: number, position: number, orientation: Orientation) {
    const result = await action.batchPlay([
            {
                _obj: 'make',
                new: {
                    _obj: 'good',
                    position: { _unit: 'pixelsUnit', _value: position },
                    orientation: { _enum: 'orientation', _value: orientation },
                    kind: { _enum: 'kind', _value: 'document' },
                    _target: [{ _ref: 'document', _id: documentID }, { _ref: 'good', _index: 1 }]
                },
                // @ts-ignore
                _target: [{ _ref: 'good' }],
                guideTarget: { _enum: 'guideTarget', _value: 'guideTargetCanvas', _id: 22 },
                _isCommand: true,
                _options: { dialogOptions: 'dontDisplay' }
            }
        ],
        { synchronousExecution: false, modalBehavior: 'fail' })

    return result[0].new._target[1]._index
}

export async function GetGuide (documentId: number, Index: number) {
    const result = await action.batchPlay(
        [
            {
                _obj: 'get',
                // @ts-ignore
                _target: [{ _ref: 'guide', _index: Index },
                    { _ref: 'document', _id: documentId }
                ],
                _options: { dialogOptions: 'dontDisplay' }
            }
        ],
        { synchronousExecution: false, modalBehavior: 'fail' }
    )

    return result[0].position._value
}

export async function Select (Bounds: Rect) {
    return await action.batchPlay(
        [
            {
                _obj: 'set',
                // @ts-ignore
                _target: [{ _ref: 'channel', _property: 'selection' }],
                to: {
                    _obj: 'rectangle',
                    top: { _unit: 'pixelsUnit', _value: Bounds.Top },
                    left: { _unit: 'pixelsUnit', _value: Bounds.Left },
                    bottom: { _unit: 'pixelsUnit', _value: Bounds.Bottom },
                    right: { _unit: 'pixelsUnit', _value: Bounds.Right }
                },
                feather: {
                    "_unit": "pixelsUnit",
                    "_value": 0
                },
                _isCommand: false,
                _options: { dialogOptions: 'dontDisplay' }
            }
        ], { synchronousExecution: false, modalBehavior: 'fail' })
}

export async function Deselect (id: number) {
    await action.batchPlay(
        [
            {
                _obj: 'set',
                // @ts-ignore
                _target: [{ _ref: 'channel', _property: 'selection' }, { _ref: 'document', _id: id }],
                to: { _enum: 'ordinal', _value: 'none' },
                _isCommand: false,
                _options: { dialogOptions: 'dontDisplay' }
            }
        ], { synchronousExecution: false, modalBehavior: 'fail' })
}

export async function TranslateSelection (Translation: Translation) {
    await action.batchPlay(
        [
            {
                _obj: 'transform',
                // @ts-ignore
                _target: [{ _ref: 'layer', _enum: 'ordinal', _value: 'targetEnum' }],
                freeTransformCenterState: { _enum: 'quadCenterState', _value: Translation.Anchor },
                offset: {
                    _obj: 'offset',
                    horizontal: { _unit: 'pixelsUnit', _value: Translation.XDelta },
                    vertical: { _unit: 'pixelsUnit', _value: Translation.YDelta }
                },
                width: { _unit: 'percentUnit', _value: Translation.Width },
                height: { _unit: 'percentUnit', _value: Translation.Height },
                interfaceIconFrameDimmed: { _enum: 'interpolationType', _value: 'nearestNeighbor' },
                _isCommand: false,
                _options: { dialogOptions: 'dontDisplay' }
            }
        ], { synchronousExecution: false, modalBehavior: 'fail' })
}

export async function DeleteHistory () {
    await action.batchPlay(
        [
            {
                _obj: 'select',
                // @ts-ignore

                _target: [{ _ref: 'historyState', _offset: -24 }],
                _isCommand: false,
                _options: { dialogOptions: 'dontDisplay' }
            }
        ], { synchronousExecution: false, modalBehavior: 'fail' })

    await action.batchPlay(
        [
            {
                _obj: 'delete',
                // @ts-ignore
                _target: [{ _ref: 'historyState', _property: 'currentHistoryState' }],
                _isCommand: false,
                _options: { dialogOptions: 'dontDisplay' }
            }
        ], { synchronousExecution: false, modalBehavior: 'fail' })
}

