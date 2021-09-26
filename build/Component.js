"use strict";
// this refers to connecting to an outside library of components stored in-engine.
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenModelDialog = void 0;
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
        titleVisibility: 'hide'
    });
    // @ts-ignore
    let returnValue = componentDialog.returnValue;
    console.log(r);
}
exports.OpenModelDialog = OpenModelDialog;
/**
 * Update the layer metadata to assign the component to, checking if the layer is compatible
 * @constructor
 */
async function UpdateLayerComponent() {
}
//# sourceMappingURL=Component.js.map