import React from 'react';
import Spectrum from 'react-uxp-spectrum';
import { app, core, ExecuteAsModalOptions, Layer } from 'photoshop';
import { storage } from 'uxp';
import { ExportTexture, IsTexture, WriteToJSONFile } from '../typescript/Utilities';
import { ReadFromMetaData } from '../typescript/Metadata';
import UILayerData from '../typescript/UILayerData';
import { Log, LogLevel } from '../typescript/Logger';

export type ExportPanelProps = { onFinished: () => void };

export function ExportPanel({ onFinished }: ExportPanelProps) {
  async function Finish() {
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

    console.table(data);

    await WriteToJSONFile(JSON.stringify(data), folder);

    onFinished();
  }

  return (
    <div>
      <Spectrum.ActionButton onClick={Finish}> Start Export</Spectrum.ActionButton>
      <sp-heading>Export Panel</sp-heading>
    </div>
  );
}
