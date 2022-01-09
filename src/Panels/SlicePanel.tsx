import {useEffect} from 'react';
import Spectrum from 'react-uxp-spectrum';
import {UpdateMetaProperty} from '../typescript/Metadata';
import {action, app} from 'photoshop';
import {Document} from 'photoshop';
import * as PSTypes from '../typescript/PSTypes';
import * as Photoshop from "photoshop";
import React = require('react');
import {DocumentCreateOptions} from 'photoshop';

export type SlicePanelProps = { onFinished: () => void; layer: Photoshop.Layer };

export function SlicePanel({ onFinished, layer }: SlicePanelProps) {
  const events: string[] = ['select'];

  const ApplySlice = async () => {
    let id: number = layer['id'];
    let slices: PSTypes.Slices = { bottom: 0, left: 0, right: 0, top: 0 };
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
    const duplicatedLayer : Photoshop.Layer = await layer.duplicate(exportDocument);
    await duplicatedLayer.rasterize('entire');
    await app.activeDocument.trim("transparent", false, false, false, false);

  };

  useEffect(() => {
    action.addNotificationListener(events, Exit).then(() => Init());
    return () => {
      action.removeNotificationListener(events, Exit).then(() => Exit());
    };
  });

  return (
    <div>
      Slice
      <Spectrum.ActionButton onClick={ApplySlice}>Slice</Spectrum.ActionButton>
    </div>
  );
}
