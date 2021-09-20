"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitialSetup = void 0;
const photoshop_1 = require("photoshop");
const UILayerData_1 = require("./UILayerData");
const Metadata_1 = require("./Metadata");
/**
 * Runs when initally running the plugin
 * create UILayerData from each layer and stores to that layer metadata
 * @constructor
 */
async function InitialSetup() {
    const layerLength = photoshop_1.app.activeDocument.layers.length;
    for (let i = 0; i < layerLength; i++) {
        // @ts-ignore
        let layerId = photoshop_1.app.activeDocument.layers[i]._id;
        let data = new UILayerData_1.UILayerData(layerId);
        await (0, Metadata_1.WriteToMetaData)(layerId, data);
    }
}
exports.InitialSetup = InitialSetup;
//# sourceMappingURL=DataManipulation.js.map