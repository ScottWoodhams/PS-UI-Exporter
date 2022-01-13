import React, {useEffect} from 'react';
import Spectrum from 'react-uxp-spectrum';
import { ExportTexture, IsTexture, WriteToJSONFile } from '../typescript/Utilities';
import {app, core, ExecuteAsModalOptions} from 'photoshop';
import { ReadFromMetaData} from '../typescript/Metadata';
import UILayerData from '../typescript/UILayerData';
import {storage} from "uxp";

export type ExportPanelProps = { onFinished: () => void };

export function ExportPanel({ onFinished }: ExportPanelProps) {

  async function Finish() {
    const initialDomain = { initialDomain: storage.domains.userDesktop };
    const folder = await storage.localFileSystem.getFolder(initialDomain);

    let data: UILayerData[] = [];

    for (const layer of app.activeDocument.layers) {
      console.log(`exporting ${layer.name}`);
      let metaString: string = await ReadFromMetaData(layer.id);
      let layerData: UILayerData = JSON.parse(metaString);
      data.push(layerData);

      if (await IsTexture(layerData.LayerType)) {
        const options: ExecuteAsModalOptions = {commandName: "Exporting texture"};
        await core.executeAsModal(()=> {
          return ExportTexture(layerData, layer, folder);
          }, options).then(onFinished);
      }
    }

    console.table(data);

    await WriteToJSONFile(JSON.stringify(data), folder);

    onFinished();
  }

/*  useEffect(() => {
    Finish();
    const options: ExecuteAsModalOptions = {commandName: "Exporting..."};
    core.executeAsModal(Finish, options).then(onFinished);
  })*/

  return (
    <div>
      <Spectrum.ActionButton onClick={Finish}> Start Export</Spectrum.ActionButton>
      <sp-heading>Export Panel</sp-heading>
    </div>
  );
}
