import React, { useEffect, useState } from 'react';
import { app, action } from 'photoshop';
import SliceRect from "../components/SliceRect";
import { ReadFromMetaData } from '../typescript/Metadata';
import UILayerData from '../typescript/UILayerData';
import TextDetails from "../components/TextDetails";
import Spectrum, { Divider } from "react-uxp-spectrum";
export type ActionPanelProps = { onExport: () => void, onSlice: () => void};

export default function ActionPanel({ onExport, onSlice }: ActionPanelProps) {

  let emptyData = new UILayerData();
  const [metadata, setCurrentMeta] = useState(emptyData);
  const events: string[] = ['select'];

  const listener = async () => {
    const i: number = app.activeDocument.activeLayers[0].id;
    const meta = await ReadFromMetaData(i);
    console.log("meta: " + meta);
    const LayerData: UILayerData = JSON.parse(meta);
    console.log(`LayerType: ${LayerData.LayerType}`);
    console.log(`Text: ${LayerData.TextDescriptor}`);
    setCurrentMeta(LayerData);
  };

  const Export = () => {
    onExport();
  }

  const Slice = () => {
    onSlice();
  }

  useEffect(() => {
    action.addNotificationListener(events, listener).then();
    return () => {
      action.removeNotificationListener(events, listener).then();
    };
  });

  return (
    <div>
      UI Exporter
      <Spectrum.ActionButton onClick={Export}>Export</Spectrum.ActionButton>
      <Divider size="large"/>
      <SliceRect rect={metadata.Bounds} slices={metadata.Slices} sliceType={metadata.SliceType} />
      <Spectrum.ActionButton onClick={Slice}>Slice</Spectrum.ActionButton>
      <Divider size="large" />
      { metadata.TextDescriptor !== undefined && <TextDetails desc={metadata.TextDescriptor}/>}
    </div>
  );
}
