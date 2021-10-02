"use strict";
// this refers to connecting to an outside library of components stored in-engine.
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenModelDialog = void 0;
const Metadata_1 = require("./Metadata");
const photoshop_1 = require("photoshop");
/**
 * Open up the component dialog inorder to assign the layer to a component
 * @constructor
 */
async function OpenModelDialog() {
    const componentDialog = document.getElementById('dialog-component');
    //@ts-ignore
    const r = await componentDialog?.uxpShowModal({
        title: 'Set Component',
        resize: 'none',
        size: {
            width: 464,
            height: 380
        },
    });
    if (r !== 'Cancel' || r !== 'reasonCanceled') {
        //@ts-ignore
        let layerId = photoshop_1.app.activeDocument.activeLayers[0]._id;
        await (0, Metadata_1.UpdateMetaProperty)(layerId, 'IsComponent', true);
        await (0, Metadata_1.UpdateMetaProperty)(layerId, 'Component', r);
    }
}
exports.OpenModelDialog = OpenModelDialog;
/**
 * Update the layer metadata to assign the component to, checking if the layer is compatible
 * @constructor
 */
async function UpdateLayerComponent() {
}
//# sourceMappingURL=Component.js.map