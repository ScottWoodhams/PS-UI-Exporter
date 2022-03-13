import { storage } from 'uxp';
import { app, core, Document, DocumentCreateOptions, ExecuteAsModalOptions, Layer } from 'photoshop';
import { Log, LogLevel } from './Logger';
import UILayerData from './UILayerData';
import { ReadFromMetaData } from './Metadata';
import { IsTexture, WriteToJSONFile } from './Utilities';
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
    await Log(LogLevel.Error, 'ExportDocument is null');
  }
  const duplicatedLayer = await layer.duplicate(exportDocument, "placeAtBeginning");

  if (duplicatedLayer === null) {
    await Log(LogLevel.Error, 'duplicated layer is null');
  }

  await duplicatedLayer.rasterize('entire');
  await duplicatedLayer.rasterize('layerStyle');
  await exportDocument.trim('transparent', true, true, true, true);

  if (layerData.SliceType !== 'None') {
    if (layerData.Slices === <PSTypes.Slices>{ bottom: 0, left: 0, right: 0, top: 0 }) {
      await Log(LogLevel.Warning, 'layer is sliced with slices all set to zero');
    }
    await ExecuteSlice(layerData.Slices, exportDocument.width, exportDocument.height, exportDocument.id, 8);
  }

  const pngFile: storage.File = await folder.createFile(`${layerData.Name}.png`, { overwrite: true });

  if (pngFile === null) {
    await Log(LogLevel.Error, 'Failed to create png file');
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
  await Promise.all(
    app.activeDocument.layers.map(async (layer: Layer) => {
      await Log(LogLevel.Info, `Exporting Layer ${layer.name}`);
      const metaString: string = await ReadFromMetaData(layer.id);
      if (metaString === null || undefined) {
        await Log(LogLevel.Error, 'Meta is null or undefined');
      }
      const layerData: UILayerData = JSON.parse(metaString);
      data.push(layerData);

      const isTexture: boolean = await IsTexture(layerData.LayerType);
      await Log(LogLevel.Info, `Layer "${layerData.Name}"  is ${layerData.LayerType}`);

      if (isTexture === true) {
        await Log(LogLevel.Info, `Layer "${layerData.Name}" is classed as texture`);

        const options: ExecuteAsModalOptions = { commandName: 'Exporting texture' };
        await core
          .executeAsModal(() => {
            return ExportTexture(layerData, layer, folder);
          }, options)
          .then();
      }
    })
  );

  await WriteToJSONFile(JSON.stringify(data), folder);
}
