import Spectrum from 'react-uxp-spectrum';
import React from 'react';
import { ExportProcess } from '../typescript/Export';

export default function ExportButton() {
  const StartExport = async () => {
    await ExportProcess();
  };

  return <Spectrum.ActionButton onClick={StartExport}>Export</Spectrum.ActionButton>;
}
