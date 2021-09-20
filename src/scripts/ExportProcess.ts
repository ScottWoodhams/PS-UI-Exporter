// @ts-ignore
import {action, app, Direction, Document, DocumentCreateOptions, Layer, Orientation} from "photoshop"
import {CreateUILayerData, UILayerData} from "./UILayerData";
import {storage} from "uxp";

export async function ExecuteExport() {
    const layerCount: number = app.activeDocument.layers.length;
    let dataArray: UILayerData[] = []

    for (let i = 0; i < layerCount; i++) {
        //@ts-ignore
        let data: UILayerData = await CreateUILayerData(app.activeDocument.layers[i]._id);
        dataArray.push(data)
    }

    console.table(dataArray)
    await WriteToJSONFile(JSON.stringify(dataArray))
    return dataArray;

}

export async function WriteToJSONFile(jsonString: string) {

    const initialDomain = {initialDomain: storage.domains.userDesktop};
    const folder = await storage.localFileSystem.getFolder(initialDomain);

    const saveOptions = {overwrite: true};
    const jsonFile = await folder.createFile('PSJson.json', saveOptions);

    const jsonWriteOptions = { format: storage.formats.utf8, append: false }
    await jsonFile.write(jsonString, jsonWriteOptions);

    return jsonFile
}
