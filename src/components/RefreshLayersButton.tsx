import Spectrum from 'react-uxp-spectrum';
import React from 'react';
import { core } from 'photoshop';
import { RefreshAllLayers } from '../typescript/Metadata';

export default function RefreshLayersButton() {
  const refreshLayers = async () => {
    await core.executeAsModal(RefreshAllLayers, { commandName: 'Refreshing metadata' });
    await core.showAlert({ message: 'Refreshed layers, components havent been reset.' });
  };

  return <Spectrum.ActionButton onClick={refreshLayers}>Refresh</Spectrum.ActionButton>;
}
