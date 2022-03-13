import React, { useEffect } from 'react';
import Spectrum from 'react-uxp-spectrum';
import { action, app, core, Layer } from 'photoshop';

import { ApplySlices, InitSlices } from '../typescript/SliceOperation';

export type SlicePanelProps = { onFinished: () => void; layer: Layer };

// todo improve ui
// todo show slice values in ui
// todo pick slice type

export function SlicePanel({ onFinished, layer }: SlicePanelProps) {
  const events: string[] = ['select'];

  const ApplySlice = async () => {
    await ApplySlices(layer);
    onFinished();
  };

  const Exit = async () => {
    await app.activeDocument.closeWithoutSaving();
    onFinished();
  };

  const Init = async () => {
    try {
      await InitSlices(layer);
    } catch (e){
      console.log("Slice Init: " + e);
    }
  };

  useEffect(() => {
    console.log("slice panel use effect");
    action.addNotificationListener(events, Exit);
    core.executeAsModal(Init, { commandName: 'Performing slice setup' });
    return () => {
      action.removeNotificationListener(events, Exit);
    };
  });

  return (
    <div>
      Slice
      <Spectrum.ActionButton onClick={ApplySlice}>Slice</Spectrum.ActionButton>
    </div>
  );
}
