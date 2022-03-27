import React, { useEffect, useState } from 'react';
import { app, action, core, ExecuteAsModalOptions } from 'photoshop';
import Spectrum from 'react-uxp-spectrum';
import { InitLayers, ReadFromMetaData, RefreshAllLayers, SetToComponent } from '../typescript/Metadata';
import UILayerData from '../typescript/UILayerData';
import InfoBox from '../components/InfoBox';
import { CompDialogReturn, OpenComponentDialog } from '../components/ComponentDialog';
import { InitSlices } from "../typescript/SliceOperation";

export type ActionPanelProps = { onExport: () => void; onSlice: () => void };

export default function ActionPanel({ onExport, onSlice }: ActionPanelProps) {
  const emptyData = new UILayerData();
  const [metadata, setCurrentMeta] = useState(emptyData);
  const [isInDocument, updateDocumentInUse] = useState(false);
  const events: string[] = ['select', 'open', 'close'];

  const listener = async event => {
    console.log(event);

    if (event === 'select') {
      const i: number = app.activeDocument.activeLayers[0].id;
      const meta = await ReadFromMetaData(i);
      const LayerData: UILayerData = JSON.parse(meta);
      setCurrentMeta(LayerData);
    }

    if (event === 'open' || event === 'close') {
      updateDocumentInUse(app.activeDocument !== null);
      if (isInDocument) {
        const options: ExecuteAsModalOptions = { commandName: 'Writing metadata to all layers' };
        await core.executeAsModal(InitLayers, options);
      }
    }
  };

  const Export = () => {
    onExport();
  };

  const Init = async () => {
    await InitSlices(app.activeDocument.activeLayers[0]);
  };

  const Slice = async () => {
    await core.executeAsModal(Init, { commandName: 'Performing slice setup' });
    onSlice();
  };

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

  const refreshLayers = async () => {
    await core.executeAsModal(RefreshAllLayers, { commandName: 'Refreshing metadata' });
    await core.showAlert({ message: 'Refreshed layers, components havent been reset.' });
  };

  useEffect(() => {
    core.executeAsModal(InitLayers, { commandName: 'Creating metadata...' });
    action.addNotificationListener(events, listener);
    updateDocumentInUse(app.activeDocument !== null);
    return () => {
      action.removeNotificationListener(events, listener);
    };
  });

  if (!isInDocument) {
    return <Spectrum.Heading size="M"> Open a document to start.</Spectrum.Heading>;
  }

  return (
    <div>
      <Spectrum.ActionButton onClick={refreshLayers}>Refresh</Spectrum.ActionButton>
      <Spectrum.ActionButton onClick={openCompDialog}>Component</Spectrum.ActionButton>
      <Spectrum.ActionButton onClick={Slice}>Slice</Spectrum.ActionButton>
      <Spectrum.ActionButton onClick={Export}>Export</Spectrum.ActionButton>
      <InfoBox data={metadata} />
    </div>
  );
}
