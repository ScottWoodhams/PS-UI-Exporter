import React, { useEffect, useState } from 'react';
import { action, app, core, ExecuteAsModalOptions } from 'photoshop';
import Spectrum from 'react-uxp-spectrum';
import { InitLayers } from '../typescript/Metadata';

export type InitPanelProps = { onFinished: () => void };

// todo improve ui

export default function InitPanel({ onFinished }: InitPanelProps) {
  const events: string[] = ['open', 'close'];
  const [isInDocument, updateDocumentInUse] = useState(false);

  const Init = async () => {
    const options: ExecuteAsModalOptions = { commandName: 'Writing metadata to all layers' };
    await core.executeAsModal(InitLayers, options);
    onFinished();
  };

  const listener = async () => {
    const isInDocument = app.activeDocument !== null;
    updateDocumentInUse(isInDocument);
  };

  useEffect(() => {
    action.addNotificationListener(events, listener);
    updateDocumentInUse(app.activeDocument !== null);
    return () => {
      action.removeNotificationListener(events, listener);
    };
  });

  if (isInDocument) {
    return (
      <div className="InitPanel">
        <Spectrum.Body size="S">
          If this document has already gone through this process, any previous data will not be reset.
        </Spectrum.Body>
        <Spectrum.Button variant="secondary" onClick={Init}>
          Initialize
        </Spectrum.Button>
      </div>
    );
  }

  return (
    <div>
      <Spectrum.Label> Plugin needs an open a document to run.</Spectrum.Label>
    </div>
  );
}
