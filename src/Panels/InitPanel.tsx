import React from 'react';
import { action, app, core } from "photoshop";
import UILayerData, { LayerDataInit } from '../typescript/UILayerData';
import { InitLayers, WriteToMetaData } from "../typescript/Metadata";
import { ExecuteAsModalOptions, ExecutionContext } from "photoshop/dom/CoreModules";
import Spectrum from 'react-uxp-spectrum';


export type InitPanelProps = { onFinished: () => void };

export default function InitPanel({ onFinished }: InitPanelProps) {
  const [state, setState] = React.useState({
    CurrentValue: 0,
  });

  const maxProgressValue: number = app.activeDocument.layers.length;

  const Init = async () => {
    console.log('init');
    const options: ExecuteAsModalOptions = {commandName: "Writing metadata to all layers"};
    await core.executeAsModal(InitLayers, options);
    onFinished();
  };

  return (
    <div>
      <sp-label>
        Depending on how many layers are in the document. Initialize may take a few seconds and a progress popup may appear.
      </sp-label>
      <Spectrum.Button variant="secondary" onClick={Init}>Start</Spectrum.Button>
    </div>
  );
}
