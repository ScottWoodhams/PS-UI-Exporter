import React from 'react';
import Spectrum from 'react-uxp-spectrum';
import { ExportTexture, IsTexture, WriteToJSONFile } from '../typescript/Utilities';
import { app } from 'photoshop';
import { ReadFromMetaData } from '../typescript/Metadata';
import UILayerData from '../typescript/UILayerData';
import { SliceType } from '../typescript/PSTypes';
import {storage} from "uxp";

export type ExportPanelProps = { onFinished: () => void };

export function ExportPanel({ onFinished }: ExportPanelProps) {
  async function Finish() {
    const initialDomain = { initialDomain: storage.domains.userDesktop };
    const folder = await storage.localFileSystem.getFolder(initialDomain);

    let data: UILayerData[] = [];

    for (const layer of app.activeDocument.layers) {
      let metaString: string = await ReadFromMetaData(layer.id);
      let layerData: UILayerData = JSON.parse(metaString);
      data.push(layerData);

      if (await IsTexture(layerData.LayerType)) {
        await ExportTexture();
      }
    }

    console.table(data);

    await WriteToJSONFile(JSON.stringify(data), folder);

    onFinished();
  }

  return (
    <div>
      <sp-heading>Export Panel</sp-heading>
      <Spectrum.ActionButton onClick={Finish}>Finish</Spectrum.ActionButton>
    </div>
  );
}
