import { useEffect } from 'react';
import Spectrum from 'react-uxp-spectrum';
import { UpdateMetaProperty } from '../typescript/Metadata';
import { action, app, core, Guide } from 'photoshop';
import { Document } from 'photoshop';
import * as PSTypes from '../typescript/PSTypes';
import * as Photoshop from 'photoshop';
import { DocumentCreateOptions } from 'photoshop';
import React from 'react';

export type SlicePanelProps = { onFinished: () => void; layer: Photoshop.Layer };

export function SlicePanel({ onFinished, layer }: SlicePanelProps) {
  const events: string[] = ['select'];

  const ApplySlice = async () => {
    let topGuide = app.activeDocument.guides[0];
    let rightGuide = app.activeDocument.guides[1];
    let bottomGuide = app.activeDocument.guides[2];
    let leftGuide = app.activeDocument.guides[3];

    let id: number = layer.id;
    let slices: PSTypes.Slices = {
      bottom: bottomGuide.coordinate,
      left: leftGuide.coordinate,
      right: rightGuide.coordinate,
      top: topGuide.coordinate,
    };
    await UpdateMetaProperty(id, 'Slices', slices);
    onFinished();
  };

  const Exit = async () => {
    await app.activeDocument.closeWithoutSaving();
    onFinished();
  };

  const Init = async () => {
    const options: DocumentCreateOptions = {
      typename: 'NewDocument',
      fill: 'transparent',
      height: app.activeDocument.height,
      mode: 'RGBColorMode',
      name: 'Image Export',
      resolution: app.activeDocument.resolution,
      width: app.activeDocument.width,
    };

    let exportDocument: Document = await app.createDocument(options);
    const duplicatedLayer: Photoshop.Layer = await layer.duplicate(exportDocument);
    await duplicatedLayer.rasterize('entire');
    await exportDocument.trim('transparent', true, true, true, true);

    exportDocument.guides.add('horizontal', 0);
    exportDocument.guides.add('vertical', exportDocument.width);
    exportDocument.guides.add('vertical', 0);
    exportDocument.guides.add('horizontal', exportDocument.height);
  };

  useEffect(() => {
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
