import React, { useEffect, useState } from 'react';
import { app, action } from 'photoshop';
import Spectrum from 'react-uxp-spectrum';
import ReactDOM from 'react-dom';
import { ReadFromMetaData } from '../typescript/Metadata';
import UILayerData from '../typescript/UILayerData';
import { Log, LogLevel } from '../typescript/Logger';
import InfoBox from '../components/InfoBox';
import ComponentDialog from '../components/ComponentDialog';

export type ActionPanelProps = { onExport: () => void; onSlice: () => void };

// todo improve ui layout
// todo add refresh for bounds
// todo add component button functionality

export default function ActionPanel({ onExport, onSlice }: ActionPanelProps) {
  const emptyData = new UILayerData();
  const [metadata, setCurrentMeta] = useState(emptyData);
  const events: string[] = ['select'];
  let componentDialog; // Reference for the <dialog> element

  const requestAuth = async () => {
    if (componentDialog === undefined) {
      componentDialog = document.createElement('dialog');
      ReactDOM.render(<ComponentDialog dialog={componentDialog} />, componentDialog);
    }
    document.body.appendChild(componentDialog);

    await componentDialog.uxpShowModal({
      title: 'Please set component id...',
      resize: 'both',
      size: {
        width: 400,
        height: 200,
      },
    });
  };

  const listener = async () => {
    const i: number = app.activeDocument.activeLayers[0].id;
    const meta = await ReadFromMetaData(i);
    if (meta === null || undefined) {
      await Log(LogLevel.Error, 'Meta is null or undefined');
    }
    const LayerData: UILayerData = JSON.parse(meta);
    setCurrentMeta(LayerData);
  };

  const Export = () => {
    onExport();
  };

  const Slice = () => {
    onSlice();
  };

  useEffect(() => {
    action.addNotificationListener(events, listener);
    return () => {
      action.removeNotificationListener(events, listener);
    };
  });

  return (
    <div>
      <Spectrum.ActionButton onClick={Slice}>Component</Spectrum.ActionButton>
      <Spectrum.ActionButton onClick={Slice}>Slice</Spectrum.ActionButton>
      <Spectrum.ActionButton onClick={Export}>Export</Spectrum.ActionButton>
      <Spectrum.ActionButton onClick={requestAuth}>popup</Spectrum.ActionButton>

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
