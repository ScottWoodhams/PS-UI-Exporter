import React, { useEffect, useState } from 'react';

import './App.css';
import { action, app, core, ExecuteAsModalOptions } from 'photoshop';
import ActionPanel from './Panels/ActionPanel';

import UILayerData from './typescript/UILayerData';
import { InitLayers, ReadFromMetaData } from './typescript/Metadata';
import {Console} from "./components/Console";

export default function App() {
  const emptyData = new UILayerData();
  const [metadata, setCurrentMeta] = useState(emptyData);
  const [isInDocument, updateDocumentInUse] = useState(false);
  const events: string[] = ['select', 'open', 'close'];

  const listener = async event => {
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

  useEffect(() => {
    core.executeAsModal(InitLayers, { commandName: 'Creating metadata...' });
    action.addNotificationListener(events, listener);
    updateDocumentInUse(app.activeDocument !== null);
    return () => {
      action.removeNotificationListener(events, listener);
    };
  });

  return (
    <div className="App">
      <ActionPanel isInDocument={isInDocument} currentLayerMetadata={metadata} />
      <Console log={'GHello World'} />
    </div>
  );
}
