"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadFromMetaData = exports.WriteToMetaData = exports.LayerKind = void 0;
const photoshop_1 = require("photoshop");
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
async function WriteToMetaData(LayerId, data) {
    await photoshop_1.action.batchPlay([{
            _obj: 'set',
            // @ts-ignore
            _target: [
                { _ref: 'property', _property: 'XMPMetadataAsUTF8' },
                { _ref: 'layer', _id: LayerId }
            ],
            to: {
                _obj: 'layer',
                XMPMetadataAsUTF8: data
            }
        }], {});
}
exports.WriteToMetaData = WriteToMetaData;
async function ReadFromMetaData(LayerId) {
    const result = await photoshop_1.action.batchPlay([
        {
            "_obj": "get",
            // @ts-ignore
            "_target": [
                { _property: "metadata" },
                { _ref: "layer", _id: LayerId }
            ],
            "_options": { "dialogOptions": "dontDisplay" }
        }
    ], {
        "synchronousExecution": false,
        "modalBehavior": "fail"
    });
    console.log(result[0].metadata.layerXMP);
    return result[0].metadata.layerXMP;
}
exports.ReadFromMetaData = ReadFromMetaData;
//# sourceMappingURL=Metadata.js.map