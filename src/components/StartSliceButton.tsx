import Spectrum from 'react-uxp-spectrum';
import React from 'react';
import { app, core } from 'photoshop';
import { InitSlices } from '../typescript/SliceOperation';

export default function StartSliceButton() {
  const CreateSliceContext = async () => {
    await InitSlices(app.activeDocument.activeLayers[0]);
  };

  const Slice = async () => {
    await core.executeAsModal(CreateSliceContext, { commandName: 'Performing slice setup' });
  };

  return <Spectrum.ActionButton onClick={Slice}>Slice</Spectrum.ActionButton>;
}
