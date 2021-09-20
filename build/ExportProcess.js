"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExportImage = exports.WriteToJSONFile = exports.ExecuteExport = void 0;
// @ts-ignore
const photoshop_1 = require("photoshop");
const UILayerData_1 = require("./UILayerData");
const uxp_1 = require("uxp");
async function ExecuteExport() {
    const layerCount = photoshop_1.app.activeDocument.layers.length;
    let dataArray = [];
    const initialDomain = { initialDomain: uxp_1.storage.domains.userDesktop };
    const folder = await uxp_1.storage.localFileSystem.getFolder(initialDomain);
    for (let i = 0; i < layerCount; i++) {
        //@ts-ignore
        let data = await (0, UILayerData_1.CreateUILayerData)(photoshop_1.app.activeDocument.layers[i]._id);
        dataArray.push(data);
        if (data.LayerType != UILayerData_1.LayerKind.text && data.LayerType != UILayerData_1.LayerKind.group && data.LayerType != UILayerData_1.LayerKind.groupEnd) {
            await ExportImage(data, photoshop_1.app.activeDocument.layers[i], folder);
        }
    }
    console.table(dataArray);
    await WriteToJSONFile(JSON.stringify(dataArray), folder);
    return dataArray;
}
exports.ExecuteExport = ExecuteExport;
async function WriteToJSONFile(jsonString, folder) {
    const saveOptions = { overwrite: true };
    const jsonFile = await folder.createFile('PSJson.json', saveOptions);
    const jsonWriteOptions = { format: uxp_1.storage.formats.utf8, append: false };
    await jsonFile.write(jsonString, jsonWriteOptions);
    return jsonFile;
}
exports.WriteToJSONFile = WriteToJSONFile;
async function ExportImage(layerData, layer, folder) {
    let exportDoc = await photoshop_1.app.createDocument({
        width: layerData.Bounds.width._value,
        height: layerData.Bounds.height._value,
        resolution: 72,
        // @ts-ignore
        mode: 'RGBColorMode',
        fill: 'transparent'
    });
    await layer.duplicate(exportDoc);
    const createFileOptions = { overwrite: true };
    //due to discrepancy between entries/blob file/storage file, we go with any type
    let pngFile = await folder.createFile(layerData.Name + '.png', createFileOptions);
    const saveOptions = {
        alphaChannels: true,
        annotations: false,
        layers: false,
        embedColorProfile: false,
        spotColors: false
    };
    await exportDoc.save(pngFile, saveOptions);
    await exportDoc.closeWithoutSaving();
}
exports.ExportImage = ExportImage;
//# sourceMappingURL=ExportProcess.js.map