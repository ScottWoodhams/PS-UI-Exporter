import React from 'react';
import { app } from 'photoshop';
import './App.css';
import ActionPanel from './Panels/ActionPanel';
import { ExportPanel } from './Panels/ExportPanel';
import { SlicePanel } from './Panels/SlicePanel';
import { Log, LogLevel } from './typescript/Logger';

export enum Panels {
  Action,
  Export,
  Slice,
}

export default function App() {
  const [state, setState] = React.useState({
    CurrentPanel: Panels.Action,
  });

  async function GoToActionPanel() {
    setState({ CurrentPanel: Panels.Action });
    await Log(LogLevel.Info, 'Set State to Action Panel');
  }

  async function GoToExportPanel() {
    setState({ CurrentPanel: Panels.Export });
    await Log(LogLevel.Info, 'Set State to Export Panel');
  }

  async function GoToSlicePanel() {
    console.log("Go to slice panel called");
    setState({ CurrentPanel: Panels.Slice });
    await Log(LogLevel.Info, 'Set State to Slice Panel');
  }

  return (
    <div className="App">
      {state.CurrentPanel === Panels.Action && <ActionPanel onExport={GoToExportPanel} onSlice={GoToSlicePanel} />}
      {state.CurrentPanel === Panels.Export && <ExportPanel onFinished={GoToActionPanel} />}
      {state.CurrentPanel === Panels.Slice && (
        <SlicePanel onFinished={GoToActionPanel} layer={app.activeDocument.activeLayers[0]} />
      )}
    </div>
  );
}
