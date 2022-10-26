import Spectrum from 'react-uxp-spectrum';
import React from 'react';
import { ExportProcess } from '../typescript/Export';
import { app, Layer, Layers } from 'photoshop';
import { GetAllLayers, walkActionThroughLayers } from '../typescript/Utilities';
import UILayerData, { LayerDataInit } from '../typescript/UILayerData';
import { WriteToMetaData } from '../typescript/Metadata';

export default function ExportButton() {
  const StartExport = async () => {
    await ExportProcess();
    // walkActionThroughLayers(app.activeDocument, layer => {
    //   console.log(layer.name);
    // });

  };

  return <Spectrum.ActionButton onClick={StartExport}>Export</Spectrum.ActionButton>;
}
