import React, { useEffect, useState } from 'react';
import { app, action } from 'photoshop';
import Spectrum, { Divider } from 'react-uxp-spectrum';
import { ReadFromMetaData } from '../typescript/Metadata';
import UILayerData from '../typescript/UILayerData';
import TextDetails from '../components/TextDetails';
import { Log, LogLevel } from '../typescript/Logger';
import InfoBox from '../components/InfoBox';

export type ActionPanelProps = { onExport: () => void; onSlice: () => void };

// todo improve ui layout
// todo add refresh for bounds
// todo add component button

export default function ActionPanel({ onExport, onSlice }: ActionPanelProps) {
  const emptyData = new UILayerData();
  const [metadata, setCurrentMeta] = useState(emptyData);
  const events: string[] = ['select'];

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

      <div className="LayerInformation">
        <InfoBox data={metadata.Bounds} title="Bounds" />
        <InfoBox data={metadata.Slices} title="Slices" />
        {metadata.TextDescriptor && <InfoBox data={metadata.TextDescriptor} title="Text" />}
        <InfoBox data={metadata.OutlineDescriptor} title="Outline" />
        <InfoBox data={metadata.ShadowDescriptor} title="Shadow" />
      </div>
    </div>
  );
}
