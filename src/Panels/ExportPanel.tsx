import { app } from 'photoshop';
import React, { useEffect } from 'react';
import Spectrum from 'react-uxp-spectrum';
import { ExportProcess } from '../typescript/Export';
import { GetFonts, GetTextureCount } from '../typescript/Utilities';

export type ExportPanelProps = { onFinished: () => void };

export function ExportPanel({ onFinished }: ExportPanelProps) {
  async function Finish() {
    await ExportProcess();
    onFinished();
  }

  useEffect(() => {
    // todo add validation checks and is possible display a button to fix the issues
  });

  return (
    <div>
      <sp-label>Total Layers: {app.activeDocument.layers}</sp-label>
      <sp-label> Textures : {GetTextureCount}</sp-label>
      <sp-label>Fonts: {GetFonts}</sp-label>
      <Spectrum.ActionButton onClick={Finish}> Start Export</Spectrum.ActionButton>
      <sp-heading>Export Panel</sp-heading>
    </div>
  );
}
