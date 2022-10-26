import { storage } from 'uxp';
import photoshop, { app, core, Document, DocumentCreateOptions, ExecuteAsModalOptions, Layer } from 'photoshop';
import { Log, LogLevel } from './Logger';
import UILayerData from './UILayerData';
import { ReadFromMetaData } from './Metadata';
import { IsTexture, walkActionThroughLayers, WriteToJSONFile } from './Utilities';
import * as PSTypes from './PSTypes';
import { ExecuteSlice } from './SliceOperation';

/**
 * Exports a layer as a PNG file
 * @param layerData data object containing information such as layer size
 * @param layer the layer to export
 * @param folder the folder to export to
 * @constructor
 */
export async function ExportTexture(layerData: UILayerData, layer: Layer, folder: storage.Folder) {
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

  const pngFile: storage.File = await folder.createFile(`${layerData.Name}.png`, { overwrite: true });

  if (pngFile === null) {
    await core.showAlert({ message: `[Export ${layerData.Name}]  failed to create png file` });
  } else {
    await Log(LogLevel.Info, `Successfully created PNG file for: ${layerData.Name}`);
  }

  await exportDocument.saveAs.png(pngFile);

  await exportDocument.closeWithoutSaving();
}

export async function ExportProcess() {
  await Log(LogLevel.Info, 'Starting Export Process...');
  const initialDomain = { initialDomain: storage.domains.userDesktop };
  const folder = await storage.localFileSystem.getFolder(initialDomain);

  if (folder === undefined || null) {
    await Log(LogLevel.Error, 'Export Folder is null or undefined');
  }

  const data: UILayerData[] = [];
  walkActionThroughLayers(app.activeDocument, async layer => {
    console.log(`Exporting Layer ${layer.name}`);

    const metaString: string = await ReadFromMetaData(layer.id);
    if (metaString === null || undefined) {
      console.log('Meta is null or undefined');
    }

    const layerData: UILayerData = JSON.parse(metaString);
    data.push(layerData);
    console.log(` Layer Type ${layer.kind}`);

    const isTexture: boolean = await IsTexture(layer.kind);

    if (isTexture === true) {
      console.log(`Layer "${layerData.Name}" is classed as texture`);

      const options: ExecuteAsModalOptions = { commandName: 'Exporting texture' };
      await core
        .executeAsModal(() => {
          return ExportTexture(layerData, layer, folder);
        }, options)
        .then();
    }
  });

  await WriteToJSONFile(JSON.stringify(data), folder);
}
