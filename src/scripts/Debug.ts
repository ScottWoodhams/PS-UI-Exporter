// Debugging helpers

import {app} from "photoshop";
import {CreateUILayerData, LayerKind, UILayerData} from "./UILayerData";


export async function DEBUG_TableLayerData(){
    const layerCount: number = app.activeDocument.layers.length;
    let dataArray: UILayerData[] = []


    for (let i = 0; i < layerCount; i++) {
        //@ts-ignore
        let layerId: number = app.activeDocument.layers[i]._id
        let data: UILayerData = await CreateUILayerData(layerId);
        await data.init(layerId)
        dataArray.push(data)
    }

    console.table(dataArray)
}