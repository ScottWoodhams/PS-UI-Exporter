import { app } from 'photoshop';
import React from 'react';
import Spectrum from 'react-uxp-spectrum';
import { ExportProcess } from '../typescript/Export';

export type ExportPanelProps = { onFinished: () => void };

export function ExportPanel({ onFinished }: ExportPanelProps) {
  // const emptyData: ValidationData = {
  //   duplicateTextureNames: 0,
  //   invalidTextLayers: 0,
  //   invalidSlices: 0,
  //   emptyLayers: 0,
  // };

  async function Finish() {
    await ExportProcess();
    onFinished();
  }

  return (
    <div>
      <sp-heading> Validation</sp-heading>
      <Spectrum.Divider size="small" />
      <div className="validationBox">
        <sp-label>Total Layers: {app.activeDocument.layers.length}</sp-label>
      </div>
      <Spectrum.Divider size="small" />
      <Spectrum.ActionButton onClick={Finish}> Start Export</Spectrum.ActionButton>
    </div>
  );
}
