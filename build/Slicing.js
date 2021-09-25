"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteHistory = exports.TranslateSelection = exports.Deselect = exports.Select = exports.GetGuide = exports.CreateGuide = exports.TrimDocument = exports.Rasterize = exports.ExecuteSlice = exports.ReadGuides = exports.CalculatePowerOfSize = exports.nearestPowerOf2 = exports.ApplyToLayerData = exports.Translation = exports.Rect = exports.Anchor = exports.Setup = void 0;
const photoshop_1 = require("photoshop");
const Metadata_1 = require("./Metadata");
//----- Setup -----//
async function Setup() {
    const activeLayer = photoshop_1.app.activeDocument.activeLayers[0];
    let sliceDoc = await photoshop_1.app.createDocument({
        width: photoshop_1.app.activeDocument.width,
        height: photoshop_1.app.activeDocument.height,
        resolution: photoshop_1.app.activeDocument.resolution,
        // @ts-ignore
        mode: 'RGBColorMode',
        name: 'SlicingDoc',
        fill: 'transparent'
    });
    let sliceLayer = await activeLayer.duplicate(sliceDoc);
    // @ts-ignore
    await Rasterize(sliceLayer._id);
    await TrimDocument();
    // @ts-ignore
    const id = sliceDoc._id;
    await CreateGuide(id, 0, "horizontal" /* horizontal */);
    await CreateGuide(id, 0, "vertical" /* vertical */);
    await CreateGuide(id, sliceDoc.height, "horizontal" /* horizontal */);
    await CreateGuide(id, sliceDoc.width, "vertical" /* vertical */);
}
exports.Setup = Setup;
var Anchor;
(function (Anchor) {
    Anchor["AnchorN"] = "QCSSide0";
    Anchor["AnchorW"] = "QCSSide3";
    Anchor["AnchorNW"] = "QCSCorner0";
})(Anchor = exports.Anchor || (exports.Anchor = {}));
class Rect {
    Top;
    Left;
    Bottom;
    Right;
    constructor(Top, Left, Bottom, Right) {
        this.Top = Top;
        this.Left = Left;
        this.Bottom = Bottom;
        this.Right = Right;
    }
}
exports.Rect = Rect;
class Translation {
    WidthPercent = 0;
    HeightPercent = 0;
    XDelta = 0;
    YDelta = 0;
    Anchor = Anchor.AnchorN;
    constructor(WidthPercent, HeightPercent, XDelta, YDelta, Anchor) {
        this.WidthPercent = WidthPercent;
        this.HeightPercent = HeightPercent;
        this.XDelta = XDelta;
        this.YDelta = YDelta;
        this.Anchor = Anchor;
    }
}
exports.Translation = Translation;
//----- Data handling -----//
async function ApplyToLayerData() {
    // @ts-ignore
    const guides = await ReadGuides(photoshop_1.app.activeDocument._id);
    photoshop_1.app.activeDocument.closeWithoutSaving();
    //@ts-ignore
    await (0, Metadata_1.UpdateMetaProperty)(photoshop_1.app.activeDocument.activeLayers[0]._id, 'Slices', guides);
    //@ts-ignore
    await (0, Metadata_1.UpdateMetaProperty)(photoshop_1.app.activeDocument.activeLayers[0]._id, 'SliceType', "Sliced");
}
exports.ApplyToLayerData = ApplyToLayerData;
//----- Slicing Execution -----//
function nearestPowerOf2(n) {
    return 1 << 31 - Math.clz32(n);
}
exports.nearestPowerOf2 = nearestPowerOf2;
async function CalculatePowerOfSize(documentID) {
    const guides = await ReadGuides(documentID);
    const widthDelta = guides.right - guides.left;
    const heightDelta = guides.bottom - guides.top;
    let newWidth = nearestPowerOf2(widthDelta);
    let newHeight = nearestPowerOf2(heightDelta);
    return { newWidth, newHeight };
}
exports.CalculatePowerOfSize = CalculatePowerOfSize;
async function ReadGuides(documentID) {
    let Top = Math.floor(await GetGuide(documentID, 1));
    let Left = Math.floor(await GetGuide(documentID, 2));
    let Bottom = Math.floor(await GetGuide(documentID, 3));
    let Right = Math.floor(await GetGuide(documentID, 4));
    return { top: Top, right: Right, bottom: Bottom, left: Left };
}
exports.ReadGuides = ReadGuides;
async function ExecuteSlice(Slices, CanvasWidth, CanvasHeight, DocID, ScalePercent, po2) {
    const ZO = 0;
    const ST = Slices.top;
    const SL = Slices.left;
    const SR = Slices.right;
    const SB = Slices.bottom;
    const CH = CanvasHeight;
    const CW = CanvasWidth;
    let ScaleWidth = ScalePercent;
    let ScaleHeight = ScalePercent;
    console.table({ ST, SL, SR, SB, CH, CW, ScaleWidth, ScaleHeight });
    if (po2) {
        let newSize = await CalculatePowerOfSize(DocID);
        ScaleWidth = CW / newSize.newWidth;
        ScaleHeight = CW / newSize.newHeight;
    }
    const NN = new Rect(ZO, SL, ST, SR);
    const WW = new Rect(ST, ZO, SB, SL);
    const SW = new Rect(SB, ZO, CH, SL);
    const SS = new Rect(SB, SL, CH, SR);
    const SE = new Rect(SB, SR, CH, CW);
    const EE = new Rect(ST, SR, SB, CW);
    const NE = new Rect(ZO, SR, ST, CW);
    const CB = new Rect(ST, SL, SB, SR);
    const NTranslation = new Translation(ScaleWidth, 100, 0, 0, Anchor.AnchorW);
    const WTranslation = new Translation(100, ScaleHeight, 0, 0, Anchor.AnchorN);
    const CTranslation = new Translation(ScaleWidth, ScaleHeight, 0, 0, Anchor.AnchorNW);
    const CenterWidth = SR - SL;
    const CenterHeight = SB - ST;
    const XMove = -((CenterWidth) - (CenterWidth) * (ScaleWidth / 100));
    const YMove = -((CenterHeight) - (CenterHeight) * (ScaleHeight / 100));
    const ETranslation = new Translation(100, ScaleHeight, XMove, 0, Anchor.AnchorNW);
    const STranslation = new Translation(ScaleWidth, 100, 0, YMove, Anchor.AnchorNW);
    const NETranslation = new Translation(100, 100, XMove, 0, Anchor.AnchorW);
    const SWTranslation = new Translation(100, 100, 0, YMove, Anchor.AnchorN);
    const SETranslation = new Translation(100, 100, XMove, YMove, Anchor.AnchorNW);
    await SelectAndTranslate(NN, NTranslation, DocID);
    await SelectAndTranslate(WW, WTranslation, DocID);
    await SelectAndTranslate(CB, CTranslation, DocID);
    await SelectAndTranslate(EE, ETranslation, DocID);
    await SelectAndTranslate(SS, STranslation, DocID);
    await SelectAndTranslate(NE, NETranslation, DocID);
    await SelectAndTranslate(SW, SWTranslation, DocID);
    await SelectAndTranslate(SE, SETranslation, DocID);
    await TrimDocument();
}
exports.ExecuteSlice = ExecuteSlice;
async function SelectAndTranslate(Bounds, Translation, DocID) {
    await Select(Bounds);
    await TranslateSelection(Translation);
    await Deselect(DocID);
}
//----- Batchplay functions -----//
async function Rasterize(id) {
    try {
        await photoshop_1.action.batchPlay([
            {
                _obj: 'rasterizeLayer',
                // @ts-ignore
                _target: [{ _ref: 'layer', _id: id }],
                what: { _enum: 'rasterizeItem', _value: 'layerStyle' },
                _isCommand: true,
                _options: { dialogOptions: 'dontDisplay' }
            }
        ], { synchronousExecution: false, modalBehavior: 'fail' });
    }
    catch (e) {
        console.log(e);
    }
}
exports.Rasterize = Rasterize;
async function TrimDocument() {
    await photoshop_1.action.batchPlay([
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
    ], { synchronousExecution: false, modalBehavior: 'fail' });
}
exports.TrimDocument = TrimDocument;
async function CreateGuide(documentID, position, orientation) {
    const result = await photoshop_1.action.batchPlay([
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
    ], { synchronousExecution: false, modalBehavior: 'fail' });
    return result[0].new._target[1]._index;
}
exports.CreateGuide = CreateGuide;
async function GetGuide(documentId, Index) {
    const result = await photoshop_1.action.batchPlay([
        {
            _obj: 'get',
            // @ts-ignore
            _target: [{ _ref: 'guide', _index: Index },
                { _ref: 'document', _id: documentId }
            ],
            _options: { dialogOptions: 'dontDisplay' }
        }
    ], { synchronousExecution: false, modalBehavior: 'fail' });
    return result[0].position._value;
}
exports.GetGuide = GetGuide;
async function Select(Bounds) {
    return await photoshop_1.action.batchPlay([
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
            _isCommand: false,
            _options: { dialogOptions: 'dontDisplay' }
        }
    ], { synchronousExecution: false, modalBehavior: 'fail' });
}
exports.Select = Select;
async function Deselect(id) {
    await photoshop_1.action.batchPlay([
        {
            _obj: 'set',
            // @ts-ignore
            _target: [{ _ref: 'channel', _property: 'selection' }, { _ref: 'document', _id: id }],
            to: { _enum: 'ordinal', _value: 'none' },
            _isCommand: false,
            _options: { dialogOptions: 'dontDisplay' }
        }
    ], { synchronousExecution: false, modalBehavior: 'fail' });
}
exports.Deselect = Deselect;
async function TranslateSelection(Translation) {
    await photoshop_1.action.batchPlay([
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
            width: { _unit: 'percentUnit', _value: Translation.WidthPercent },
            height: { _unit: 'percentUnit', _value: Translation.HeightPercent },
            interfaceIconFrameDimmed: { _enum: 'interpolationType', _value: '"nearestNeighbor"' },
            _isCommand: false,
            _options: { dialogOptions: 'dontDisplay' }
        }
    ], { synchronousExecution: false, modalBehavior: 'fail' });
}
exports.TranslateSelection = TranslateSelection;
async function DeleteHistory() {
    await photoshop_1.action.batchPlay([
        {
            _obj: 'select',
            // @ts-ignore
            _target: [{ _ref: 'historyState', _offset: -24 }],
            _isCommand: false,
            _options: { dialogOptions: 'dontDisplay' }
        }
    ], { synchronousExecution: false, modalBehavior: 'fail' });
    await photoshop_1.action.batchPlay([
        {
            _obj: 'delete',
            // @ts-ignore
            _target: [{ _ref: 'historyState', _property: 'currentHistoryState' }],
            _isCommand: false,
            _options: { dialogOptions: 'dontDisplay' }
        }
    ], { synchronousExecution: false, modalBehavior: 'fail' });
}
exports.DeleteHistory = DeleteHistory;
//# sourceMappingURL=Slicing.js.map