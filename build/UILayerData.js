"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetTextKey = exports.GetLayerDesc = exports.CreateUILayerData = exports.UILayerData = exports.LayerKind = void 0;
const photoshop_1 = require("photoshop");
const Metadata_1 = require("./Metadata");
var LayerKind;
(function (LayerKind) {
    LayerKind[LayerKind["any"] = 0] = "any";
    LayerKind[LayerKind["pixel"] = 1] = "pixel";
    LayerKind[LayerKind["adjustment"] = 2] = "adjustment";
    LayerKind[LayerKind["text"] = 3] = "text";
    LayerKind[LayerKind["vector"] = 4] = "vector";
    LayerKind[LayerKind["smartObject"] = 5] = "smartObject";
    LayerKind[LayerKind["video"] = 6] = "video";
    LayerKind[LayerKind["group"] = 7] = "group";
    LayerKind[LayerKind["threeD"] = 8] = "threeD";
    LayerKind[LayerKind["gradient"] = 9] = "gradient";
    LayerKind[LayerKind["pattern"] = 10] = "pattern";
    LayerKind[LayerKind["solidColor"] = 11] = "solidColor";
    LayerKind[LayerKind["background"] = 12] = "background";
    LayerKind[LayerKind["groupEnd"] = 13] = "groupEnd";
})(LayerKind = exports.LayerKind || (exports.LayerKind = {}));
class UILayerData {
    //general - required
    Name;
    LayerType;
    Bounds;
    HasLayerEffects;
    //Image specific
    Slices;
    SliceType;
    //Text Specific
    TextDescriptor;
    //outline
    frameFX;
    dropShadow;
    constructor(LayerID) {
        this.Name = GetLayerProperty(LayerID, 'name');
        this.LayerType = GetLayerProperty(LayerID, 'layerKind');
        this.Bounds = GetLayerProperty(LayerID, 'bounds');
        this.HasLayerEffects = GetLayerProperty(LayerID, 'layerFXVisible');
    }
    async init(LayerID) {
        if (this.LayerType == LayerKind.text) {
            this.TextDescriptor = await GetTextKey(LayerID);
            if (this.HasLayerEffects) {
                let layerEffects = await GetLayerProperty(LayerID, 'layerEffects');
                this.frameFX = layerEffects.frameFX;
                this.dropShadow = layerEffects.dropShadow;
            }
        }
        else if (this.LayerType != LayerKind.group && this.LayerType != LayerKind.groupEnd) {
            this.SliceType = await (0, Metadata_1.GetMetaProperty)(LayerID, 'SliceType');
            this.Slices = await (0, Metadata_1.GetMetaProperty)(LayerID, 'Slices');
        }
    }
}
exports.UILayerData = UILayerData;
async function CreateUILayerData(LayerID) {
    let data = new UILayerData(LayerID);
    return data;
}
exports.CreateUILayerData = CreateUILayerData;
async function GetLayerDesc(layerID) {
    const result = await photoshop_1.action.batchPlay([
        {
            _obj: "get",
            //@ts-ignore
            _target: [
                { _ref: "layer", _id: layerID },
                //@ts-ignore
                { _ref: "document", _id: photoshop_1.app.activeDocument._id }
            ],
            _options: { dialogOptions: "dontDisplay" }
        }
    ], { "synchronousExecution": false, "modalBehavior": "fail" });
    return result;
}
exports.GetLayerDesc = GetLayerDesc;
function CreateAndRunDescriptor(layerId, property) {
    return {
        _obj: 'get',
        //@ts-ignore
        _target: [
            { _property: property },
            { _ref: 'layer', _id: layerId }
        ],
        _options: { dialogOptions: 'dontDisplay' }
    };
}
// Text Properties
async function GetTextKey(layerId) {
    const t = await photoshop_1.action.batchPlay([CreateAndRunDescriptor(layerId, "textKey")], { synchronousExecution: true });
    return t[0].textKey;
}
exports.GetTextKey = GetTextKey;
async function GetTextFont(layerId) {
    const textKey = await GetTextKey(0);
    return textKey.textStyleRange[0].textStyle.fontName;
}
async function GetTextSize(layerId) {
    const textKey = await GetTextKey(0);
    return textKey.textStyleRange[0].textStyle.size._value;
}
async function GetTextContent(layerId) {
    const textKey = await GetTextKey(0);
    return textKey.textKey;
}
async function GetTextColor(layerId) {
    const textKey = await GetTextKey(0);
    return textKey.textStyleRange[0].textStyle.color;
}
async function GetTextJustification(layerId) {
    const textKey = await GetTextKey(0);
    return textKey.paragraphStyleRange[0].paragraphStyle.align?._value;
}
async function GetTextType(layerId) {
    const textKey = await GetTextKey(0);
    return textKey.textShape[0].char._value;
}
function GetLayerProperty(layerId, _property) {
    const result = photoshop_1.action.batchPlay([
        {
            _obj: 'get',
            //@ts-ignore
            _target: [{ _property }, { _ref: 'layer', _id: layerId }],
        },
    ], { synchronousExecution: true });
    // @ts-ignore
    return result[0][_property];
}
//# sourceMappingURL=UILayerData.js.map