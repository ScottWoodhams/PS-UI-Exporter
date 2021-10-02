// this refers to connecting to an outside library of components stored in-engine.

import {UpdateMetaProperty} from "./Metadata";
import {app} from "photoshop";

/**
 * Open up the component dialog inorder to assign the layer to a component
 * @constructor
 */
export async function OpenModelDialog() {
    const componentDialog = document.getElementById('dialog-component')
    //@ts-ignore
    const r = await componentDialog?.uxpShowModal({
        title: 'Set Component',
        resize: 'none', // "both", "horizontal", "vertical",
        size: {
            width: 464,
            height: 380
        },

    })

    if(r !== 'Cancel' || r !== 'reasonCanceled') {
        //@ts-ignore
        let layerId: number = app.activeDocument.activeLayers[0]._id
        await UpdateMetaProperty(layerId, 'IsComponent', true)
        await UpdateMetaProperty(layerId, 'Component', r)
    }
}
