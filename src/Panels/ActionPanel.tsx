import React from 'react';
import Spectrum from 'react-uxp-spectrum';
import StartSliceButton from '../components/StartSliceButton';
import RefreshLayersButton from '../components/RefreshLayersButton';
import OpenComponentDialogButton from '../components/OpenComponentDialogButton';
import ExportButton from '../components/ExportButton';
import UILayerData from '../typescript/UILayerData';

export type ActionPanelProps = { isInDocument: boolean; currentLayerMetadata: UILayerData };

export default function ActionPanel(props: ActionPanelProps) {
  if (props.isInDocument === false) {
    return <Spectrum.Heading size="M"> Open a document to start.</Spectrum.Heading>;
  }

  return (
    <div>
      <RefreshLayersButton />
      <OpenComponentDialogButton />
      <StartSliceButton />
      <ExportButton />
    </div>
  );
}
