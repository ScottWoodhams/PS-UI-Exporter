import React from 'react';
import Spectrum from 'react-uxp-spectrum';
import { ExportProcess } from '../typescript/Export';

export type ExportPanelProps = { onFinished: () => void };

export function ExportPanel({ onFinished }: ExportPanelProps) {
  async function Finish() {
    await ExportProcess();
    onFinished();
  }

  return (
    <div>
      <Spectrum.ActionButton onClick={Finish}> Start Export</Spectrum.ActionButton>
      <sp-heading>Export Panel</sp-heading>
    </div>
  );
}
