import React, { useEffect } from 'react';
import Spectrum from 'react-uxp-spectrum';
import { action, app, core, Document, DocumentCreateOptions } from 'photoshop';

import * as Photoshop from 'photoshop';
import * as PSTypes from '../typescript/PSTypes';

import { UpdateMetaProperty } from '../typescript/Metadata';

export type SlicePanelProps = { onFinished: () => void; layer: Photoshop.Layer };

// todo improve ui
// todo show slice values in ui

export function SlicePanel({ onFinished, layer }: SlicePanelProps) {
  const events: string[] = ['select'];

  const ApplySlice = async () => {
    const topGuide = app.activeDocument.guides[0];
    const leftGuide = app.activeDocument.guides[1];
    const bottomGuide = app.activeDocument.guides[2];
    const rightGuide = app.activeDocument.guides[3];

    const { id } = layer;
    const slices: PSTypes.Slices = {
      top: topGuide.coordinate,
      left: leftGuide.coordinate,
      bottom: bottomGuide.coordinate,
      right: rightGuide.coordinate,
    };

    console.log({ slices });

    await core.executeAsModal(async () => app.activeDocument.closeWithoutSaving(), { commandName: 'closing document' });

    await core.executeAsModal(async () => UpdateMetaProperty(id, 'Slices', slices), {
      commandName: 'Updating slice property',
    });

    await core.executeAsModal(async () => UpdateMetaProperty(id, 'SliceType', 'Sliced'), {
      commandName: 'Updating slice property',
    });

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

    const exportDocument: Document = await app.createDocument(options);
    const duplicatedLayer: Photoshop.Layer = await layer.duplicate(exportDocument);
    await duplicatedLayer.rasterize('entire');
    await exportDocument.trim('transparent', true, true, true, true);

    exportDocument.guides.add('horizontal', 0);
    exportDocument.guides.add('vertical', 0);
    exportDocument.guides.add('horizontal', exportDocument.height);
    exportDocument.guides.add('vertical', exportDocument.width);

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
