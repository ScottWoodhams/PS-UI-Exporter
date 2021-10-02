"use strict";
// Debugging helpers
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEBUG_TableLayerData = void 0;
const photoshop_1 = require("photoshop");
const UILayerData_1 = require("./UILayerData");
async function DEBUG_TableLayerData() {
    const layerCount = photoshop_1.app.activeDocument.layers.length;
    let dataArray = [];
    for (let i = 0; i < layerCount; i++) {
        //@ts-ignore
        let layerId = photoshop_1.app.activeDocument.layers[i]._id;
        let data = await (0, UILayerData_1.CreateUILayerData)(layerId);
        await data.init(layerId);
        dataArray.push(data);
    }
    console.table(dataArray);
}
exports.DEBUG_TableLayerData = DEBUG_TableLayerData;
//# sourceMappingURL=Debug.js.map