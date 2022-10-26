import { storage } from 'uxp';
import { app, core, Document, DocumentCreateOptions, ExecuteAsModalOptions, Layer } from 'photoshop';
import UILayerData from './UILayerData';
import { ReadFromMetaData } from './Metadata';
import { IsTextureLayerObjKind, walkActionThroughLayers } from './Utilities';
import * as PSTypes from './PSTypes';
import { ExecuteSlice } from './SliceOperation';

/**
 * Exports a layer as a PNG file
 * @param layerData data object containing information such as layer size
 * @param layer the layer to export
 * @param folder the folder to export to
 * @constructor
 */
export async function ExportTexture(layerData: UILayerData, layer: Layer, folder) {
  const options: DocumentCreateOptions = {
    typename: '',
    fill: 'transparent',
    height: app.activeDocument.height,
    mode: 'RGBColorMode',
    name: 'Image Export',
    resolution: app.activeDocument.resolution,
    width: app.activeDocument.width,
  };

  const exportDocument: Document = await app.createDocument(options);

  if (exportDocument === null) {
    await core.showAlert({ message: '[Export] export document is null' });
    return;
  }

  const duplicatedLayer = await layer.duplicate(exportDocument, 'placeAtBeginning');

  if (duplicatedLayer === null) {
    await core.showAlert({ message: '[Export] duplicated layer is null' });
    return;
  }

  await exportDocument.rasterizeAllLayers();
  await exportDocument.trim('transparent', true, true, true, true);

  if (layerData.SliceType !== 'None') {
    if (layerData.Slices === <PSTypes.Slices>{ bottom: 0, left: 0, right: 0, top: 0 }) {
      await core.showAlert({ message: `[Export] ${layerData.Name}layer is set to slice with 0 params` });
    }
    await ExecuteSlice(layerData.Slices, exportDocument.width, exportDocument.height, exportDocument.id, 8);
  }

  const pngFile = await folder.createFile(`${layerData.Name}.png`, { overwrite: true });

  await exportDocument.saveAs.png(pngFile);

  await exportDocument.closeWithoutSaving();
}

/**
 * Runs the export process on each layer
 * @constructor
 */
export async function ExportProcess() {
  const initialDomain = { initialDomain: storage.domains.userDesktop };
  const folder = await storage.localFileSystem.getFolder(initialDomain);

  if (folder === undefined || null) {
    return;
  }

  const data: UILayerData[] = [];
  walkActionThroughLayers(app.activeDocument, async layer => {
    const metaString: string = await ReadFromMetaData(layer.id);

    if (metaString !== undefined) {
      const layerData: UILayerData = JSON.parse(metaString);

      data.push(layerData);

      if (await IsTextureLayerObjKind(layer.kind)) {
        const options: ExecuteAsModalOptions = { commandName: 'Exporting texture' };
        await core
          .executeAsModal(() => {
            return ExportTexture(layerData, layer, folder);
          }, options)
          .then();
      }
    }
  });

  const saveOptions = { overwrite: true };
  const jsonFile = await folder.createFile('PSJson.json', saveOptions);

  const jsonWriteOptions = { format: storage.formats.utf8, append: false };
  await jsonFile.write(JSON.stringify(data), jsonWriteOptions);
}
