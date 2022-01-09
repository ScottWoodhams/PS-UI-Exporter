import React from 'react';
import './App.css';
import InitPanel from './Panels/InitPanel';
import ActionPanel from './Panels/ActionPanel';
import { ExportPanel } from './Panels/ExportPanel';
import { SlicePanel } from './Panels/SlicePanel';
import { app } from 'photoshop';

export enum Panels {
  Initialise,
  Action,
  Export,
  Slice,
}

export default function App() {
  const [state, setState] = React.useState({
    CurrentPanel: Panels.Initialise,
  });

  function GoToActionPanel() {
    setState({ CurrentPanel: Panels.Action });
  }

  function GoToExportPanel() {
    setState({ CurrentPanel: Panels.Export });
  }

  function GoToSlicePanel() {
    setState({ CurrentPanel: Panels.Slice });
  }

  return (
    <div className="App">
      <sp-label>{Panels[state.CurrentPanel.valueOf()] + ' Hi'}</sp-label>
      {state.CurrentPanel === Panels.Initialise && <InitPanel onFinished={GoToActionPanel} />}
      {state.CurrentPanel === Panels.Action && <ActionPanel onExport={GoToExportPanel} onSlice={GoToSlicePanel} />}
      {state.CurrentPanel === Panels.Export && <ExportPanel onFinished={GoToActionPanel} />}
      {state.CurrentPanel === Panels.Slice && (
        <SlicePanel onFinished={GoToActionPanel} layer={app.activeDocument.activeLayers[0]} />
      )}
    </div>
  );
}
