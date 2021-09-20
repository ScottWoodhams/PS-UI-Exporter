import {app} from "photoshop";
import {UILayerData} from "./UILayerData";
import {WriteToMetaData} from "./Metadata";


/**
 * Runs when initally running the plugin
 * create UILayerData from each layer and stores to that layer metadata
 * @constructor
 */
export async function InitialSetup() {
    const layerLength = app.activeDocument.layers.length

    for(let i = 0; i < layerLength; i++) {
        // @ts-ignore
        let layerId: number = app.activeDocument.layers[i]._id;

        let data: UILayerData = new UILayerData(layerId)
        await WriteToMetaData(layerId, data);
    }
}