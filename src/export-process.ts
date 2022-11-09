import {walkActionThroughLayers} from "./Utilities";
import {app, core} from "photoshop";
import {Document} from "photoshop/dom/Document";
import {UILayerData} from "./classes/ui-layer-data";
import {Slices} from "./classes/slices";
import {Layer} from "photoshop/dom/Layer";
import {storage} from "uxp"
import {DocumentCreateOptions} from "photoshop/dom/objects/CreateOptions";
import {DocumentFill, ElementPlacement, NewDocumentMode} from "photoshop/dom/Constants";
import {RunSliceProcess} from "./slice-execution";




/**
 * Runs the export process on each layer via modal execution
 * @constructor
 */
export function RunExport() {
    core.executeAsModal(Internal_RunExport, {commandName: 'Running Export'});
}

async function Internal_RunExport() {

    let layerList: UILayerData[] = null;
    const initialDomain = {initialDomain: storage.domains.userDesktop};
    const folder: storage.Folder = await storage.localFileSystem.getFolder(initialDomain);

    if (folder === undefined || null) {
        await core.showAlert({message: "No folder has been selected, cancelling export."})
        return;
    }

    walkActionThroughLayers(app.activeDocument, async (layer) => {

        let data = new UILayerData(layer);
        layerList.push(data);

        // if (IsTexture(layer)) {
        //     await ExportTexture(layer, data.Slices, folder);
        // }
    })

    const jsonFile: storage.File = await folder.createFile('PSJson.json', {overwrite: true});
    jsonFile.write(JSON.stringify(layerList), {format: storage.formats.utf8, append: false});

}

/*
Have to declare trim type here due to module import error using the enum in the constants type package
 */
export enum TrimType {TRANSPARENT = "transparent"}

async function ExportTexture(layer: Layer, slices: Slices, folder: storage.Folder) {
    const options: DocumentCreateOptions = {
        typename: '',
        fill: DocumentFill.TRANSPARENT,
        height: app.activeDocument.height,
        mode: NewDocumentMode.RGB,
        name: 'Image Export',
        resolution: app.activeDocument.resolution,
        width: app.activeDocument.width,
    };

    const exportDocument: Document = await app.createDocument(options);
    await layer.duplicate(exportDocument, ElementPlacement.PLACEATBEGINNING);
    app.activeDocument = exportDocument;
    await exportDocument.rasterizeAllLayers();


    await exportDocument.trim(TrimType.TRANSPARENT);

    if(slices !== Slices.Zero) {
        await RunSliceProcess(slices);
    }

    //due to inaccurate typing with uxp, we use the 'any' type
    const pngFile : any = await folder.createFile(`${layer.name}.png`, { overwrite: true });
    await exportDocument.saveAs.png(pngFile);
    await exportDocument.closeWithoutSaving();
}
