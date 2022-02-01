import React from 'react';
import Spectrum from 'react-uxp-spectrum';
import { app, core, ExecuteAsModalOptions, Layer } from 'photoshop';
import { storage } from 'uxp';
import { ExportTexture, IsTexture, WriteToJSONFile } from '../typescript/Utilities';
import { ReadFromMetaData } from '../typescript/Metadata';
import UILayerData from '../typescript/UILayerData';
import {ELayerType} from "../typescript/PSTypes";

export type ExportPanelProps = { onFinished: () => void };

export function ExportPanel({ onFinished }: ExportPanelProps) {
  async function Finish() {
    const initialDomain = { initialDomain: storage.domains.userDesktop };
    const folder = await storage.localFileSystem.getFolder(initialDomain);

    const data: UILayerData[] = [];
    await Promise.all(
      app.activeDocument.layers.map(async (layer: Layer) => {
        const metaString: string = await ReadFromMetaData(layer.id);
        const layerData: UILayerData = JSON.parse(metaString);
        data.push(layerData);

        const isTexture: boolean = await IsTexture(layerData.LayerType);

        if (isTexture === true) {
          console.log('exporting texure');
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
