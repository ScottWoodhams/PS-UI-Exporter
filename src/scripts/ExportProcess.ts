// @ts-ignore
import {action, app, Direction, Document, DocumentCreateOptions, Layer, Orientation} from "photoshop"
import {CreateUILayerData, LayerKind, UILayerData} from "./UILayerData";
import {storage} from "uxp";


export async function ExecuteExport() {
    const layerCount: number = app.activeDocument.layers.length;
    let dataArray: UILayerData[] = []

    const initialDomain = {initialDomain: storage.domains.userDesktop};
    const folder = await storage.localFileSystem.getFolder(initialDomain);

    for (let i = 0; i < layerCount; i++) {
        //@ts-ignore
        let layerId: number = app.activeDocument.layers[i]._id
        let data: UILayerData = await CreateUILayerData(layerId);
        await data.init(layerId)
        dataArray.push(data)

        if(data.LayerType == LayerKind.text){


            continue;
        }

        if (data.LayerType != LayerKind.group && data.LayerType != LayerKind.groupEnd) {
            await ExportImage(data, app.activeDocument.layers[i], folder);
        }


    }

    console.table(dataArray)
    await WriteToJSONFile(JSON.stringify(dataArray), folder)
    return dataArray;

}


export async function WriteToJSONFile(jsonString: string, folder: storage.Folder) {

    const saveOptions = {overwrite: true};
    const jsonFile = await folder.createFile('PSJson.json', saveOptions);

    const jsonWriteOptions = { format: storage.formats.utf8, append: false }
    await jsonFile.write(jsonString, jsonWriteOptions);

    return jsonFile
}

export async function ExportImage(layerData: UILayerData, layer: Layer,  folder: storage.Folder) {

    let exportDoc: Document = <Document>await app.createDocument({
        width: layerData.Bounds.width._value,
        height:  layerData.Bounds.height._value,
        resolution: 72,
        // @ts-ignore
        mode: 'RGBColorMode',
        fill: 'transparent'
    })


    await layer.duplicate(exportDoc)

    const createFileOptions = {overwrite: true}

    //due to discrepancy between entries/blob file/storage file, we go with any type
    let pngFile: any =  await folder.createFile(layerData.Name + '.png', createFileOptions)

    const saveOptions = {
        alphaChannels: true,
        annotations: false,
        layers: false,
        embedColorProfile: false,
        spotColors: false
    }

    await exportDoc.save( pngFile, saveOptions)
    await exportDoc.closeWithoutSaving()
}