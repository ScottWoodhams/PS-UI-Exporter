import React, { useEffect, useState } from 'react';
import {app, action, core, ExecuteAsModalOptions} from 'photoshop';
import Spectrum from 'react-uxp-spectrum';
import {InitLayers, ReadFromMetaData, SetToComponent} from '../typescript/Metadata';
import UILayerData from '../typescript/UILayerData';
import { Log, LogLevel } from '../typescript/Logger';
import InfoBox from '../components/InfoBox';
import { CompDialogReturn, OpenComponentDialog } from '../components/ComponentDialog';

export type ActionPanelProps = { onExport: () => void; onSlice: () => void };

// todo improve ui layout
// todo add refresh for bounds

export default function ActionPanel({ onExport, onSlice }: ActionPanelProps) {
  const emptyData = new UILayerData();
  const [metadata, setCurrentMeta] = useState(emptyData);
  const [isInDocument, updateDocumentInUse] = useState(false);
  const events: string[] = ['select', 'open', 'close'];

  const listener = async (event) => {
    if(event === "select"){
      const i: number = app.activeDocument.activeLayers[0].id;
      const meta = await ReadFromMetaData(i);
      const LayerData: UILayerData = JSON.parse(meta);
      setCurrentMeta(LayerData);
    }

    if(event === 'open' || event === 'close'){
      updateDocumentInUse(app.activeDocument !== null);
      if(isInDocument){
        const options: ExecuteAsModalOptions = { commandName: 'Writing metadata to all layers' };
        await core.executeAsModal(InitLayers, options);
      }
    }

  };

  const Export = () => {
    onExport();
  };

  const Slice = () => {
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

  useEffect(() => {
    action.addNotificationListener(events, listener);
    updateDocumentInUse(app.activeDocument !== null);
    return () => {
      action.removeNotificationListener(events, listener);
    };
  });

  if(!isInDocument) {
    return <Spectrum.Heading size="M"> Open a document to start.</Spectrum.Heading>
  }

  return (

      <div>
      <Spectrum.ActionButton onClick={openCompDialog}>Component</Spectrum.ActionButton>
      <Spectrum.ActionButton onClick={Slice}>Slice</Spectrum.ActionButton>
      <Spectrum.ActionButton onClick={Export}>Export</Spectrum.ActionButton>

      <div className="LayerInformation">
        <InfoBox data={metadata.Bounds} title="Bounds" />
        {metadata.Slices && <InfoBox data={metadata.Slices} title="Slices" />}
        {metadata.TextDescriptor && <InfoBox data={metadata.TextDescriptor} title="Text" />}
        {metadata.OutlineDescriptor && <InfoBox data={metadata.OutlineDescriptor} title="Outline" />}
        {metadata.ShadowDescriptor && <InfoBox data={metadata.ShadowDescriptor} title="Shadow" />}
      </div>
    </div>
  );
}
