"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WriteToJSONFile = exports.ExecuteExport = void 0;
// @ts-ignore
const photoshop_1 = require("photoshop");
const UILayerData_1 = require("./UILayerData");
const uxp_1 = require("uxp");
async function ExecuteExport() {
    const layerCount = photoshop_1.app.activeDocument.layers.length;
    let dataArray = [];
    for (let i = 0; i < layerCount; i++) {
        //@ts-ignore
        let data = await (0, UILayerData_1.CreateUILayerData)(photoshop_1.app.activeDocument.layers[i]._id);
        dataArray.push(data);
    }
    console.table(dataArray);
    await WriteToJSONFile(JSON.stringify(dataArray));
    return dataArray;
}
exports.ExecuteExport = ExecuteExport;
async function WriteToJSONFile(jsonString) {
    const initialDomain = { initialDomain: uxp_1.storage.domains.userDesktop };
    const folder = await uxp_1.storage.localFileSystem.getFolder(initialDomain);
    const saveOptions = { overwrite: true };
    const jsonFile = await folder.createFile('PSJson.json', saveOptions);
    const jsonWriteOptions = { format: uxp_1.storage.formats.utf8, append: false };
    await jsonFile.write(jsonString, jsonWriteOptions);
    return jsonFile;
}
exports.WriteToJSONFile = WriteToJSONFile;
//# sourceMappingURL=ExportProcess.js.map