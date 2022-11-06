import {IsTexture, walkActionThroughLayers} from "./Utilities";
import {app, core} from "photoshop";
import {UILayerData} from "./ui-layer-data";
import {Slices} from "./slices";
import {Layer} from "photoshop/dom/Layer";
import {storage} from "uxp"
import {ExecutionContext} from "photoshop/dom/CoreModules";

/**
 * Runs the export process on each layer via modal execution
 * @constructor
 */
export function RunExport() {
    core.executeAsModal(Internal_RunExport, {commandName: 'Running Export'});
}

async function Internal_RunExport(executionContext: ExecutionContext) {

    let layerList: UILayerData[] = null;
    const initialDomain = {initialDomain: storage.domains.userDesktop};
    const folder: storage.Folder = await storage.localFileSystem.getFolder(initialDomain);

    if (folder === undefined || null) {
        await core.showAlert({message: "No folder has been selected, cancelling export."})
        return;
    }

    walkActionThroughLayers(app.activeDocument, (layer) => {

        let data = new UILayerData(layer);
        layerList.push(data);

        if (IsTexture(layer)) {
            ExportTexture(layer, data.Slices, folder);
        }
    })

    const jsonFile: storage.File = await folder.createFile('PSJson.json', {overwrite: true});
    jsonFile.write(JSON.stringify(layerList), {format: storage.formats.utf8, append: false});

}

function ExportTexture(layer: Layer, slices: Slices, folder: storage.Folder) {
    console.log(`${layer.name} | ${slices.Print} | ${folder.name}`);
}
