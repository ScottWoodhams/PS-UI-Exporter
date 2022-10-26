import Spectrum from 'react-uxp-spectrum';
import React from 'react';
import { app, core } from 'photoshop';
import { CompDialogReturn, OpenComponentDialog } from './ComponentDialog';
import { SetToComponent } from '../typescript/Metadata';

export default function OpenComponentDialogButton()
{
  const openCompDialog = async () => {
    const workingLayer = app.activeDocument.activeLayers[0];
    if (workingLayer.kind !== 'group') {
      await core.showAlert({ message: 'Must have a group layer selected' });
    } else {
      const result: CompDialogReturn = await OpenComponentDialog();
      if (result.reason === 'Confirm') {
        await SetToComponent(workingLayer.id, result.id);
      }
    }
  };

  return <Spectrum.ActionButton onClick={openCompDialog}>Component</Spectrum.ActionButton>;
}
