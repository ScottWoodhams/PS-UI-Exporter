import React from 'react';
import { app } from 'photoshop';
import './App.css';
import InitPanel from './Panels/InitPanel';
import ActionPanel from './Panels/ActionPanel';
import { ExportPanel } from './Panels/ExportPanel';
import { SlicePanel } from './Panels/SlicePanel';
import {Log, LogLevel} from "./typescript/Logger";

export enum Panels {
  Initialise,
  Action,
  Export,
  Slice,
}

export default function App() {
  const [state, setState] = React.useState({
    CurrentPanel: Panels.Action,
  });

  function GoToActionPanel() {
    setState({ CurrentPanel: Panels.Action });
    Log(LogLevel.Info, 'Set State to Action Panel');
  }

  function GoToExportPanel() {
    setState({ CurrentPanel: Panels.Export });
    Log(LogLevel.Info, 'Set State to Export Panel');
  }

  function GoToSlicePanel() {
    setState({ CurrentPanel: Panels.Slice });
    Log(LogLevel.Info, 'Set State to Slice Panel');
  }

  return (
    <div className="App">
      {state.CurrentPanel === Panels.Initialise && <InitPanel onFinished={GoToActionPanel} />}
      {state.CurrentPanel === Panels.Action && <ActionPanel onExport={GoToExportPanel} onSlice={GoToSlicePanel} />}
      {state.CurrentPanel === Panels.Export && <ExportPanel onFinished={GoToActionPanel} />}
      {state.CurrentPanel === Panels.Slice && (
        <SlicePanel onFinished={GoToActionPanel} layer={app.activeDocument.activeLayers[0]} />
      )}
    </div>
  );
}
