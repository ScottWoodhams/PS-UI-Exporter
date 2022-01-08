import React, {useEffect} from 'react';
import Spectrum from 'react-uxp-spectrum';
import {UpdateMetaProperty} from '../typescript/Metadata';
import {action, app} from 'photoshop';
import {Document} from 'photoshop/dom/Document';
import {Layer} from 'photoshop/dom/Layer';
import * as PSTypes from '../typescript/PSTypes';
import {DocumentCreateOptions} from 'photoshop/dom/objects/CreateOptions';
import {DocFill, RasterizeLayerType, RGBDocumentColorMode, Trim} from "../typescript/Constants";


export type SlicePanelProps = { onFinished: () => void; layer: Layer };

export function SlicePanel({ onFinished, layer }: SlicePanelProps) {
  const events: string[] = ['select'];

  const ApplySlice = async () => {
    let slices: PSTypes.Slices = { bottom: 0, left: 0, right: 0, top: 0 };
    await UpdateMetaProperty(layer.id, 'Slices', slices);
    onFinished();
  };

  const Exit = async () => {
    await app.activeDocument.close();
    onFinished();
  };

  const init = async () => {
    const options: DocumentCreateOptions = {
      typename: '',
      fill: DocFill,
      height: app.activeDocument.height,
      mode: RGBDocumentColorMode,
      name: 'Image Export',
      resolution: app.activeDocument.resolution,
      width: app.activeDocument.width,
    };

    let exportDocument: Document = await app.createDocument(options);
    let duplicatedLayer = await layer.duplicate(exportDocument);

    await duplicatedLayer.rasterize(RasterizeLayerType);
    await app.activeDocument.trim(Trim);
  };

  useEffect(() => {
    action.addNotificationListener(events, Exit);
    init();
    return () => {
      action.removeNotificationListener(events, Exit);
      Exit();
    };
  });

  return (
    <div>
      Slice
      <Spectrum.ActionButton onClick={ApplySlice}>Slice</Spectrum.ActionButton>
    </div>
  );
}
