// App imports
import React from 'react';

import './App.css';
import InitPanel from './Panels/InitPanel';
import ActionPanel from './Panels/ActionPanel';
import Spectrum from "react-uxp-spectrum";
import { ExportPanel } from "./Panels/ExportPanel";


// eslint-disable-next-line no-shadow
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
    let currentPanel = state.CurrentPanel;
    currentPanel = Panels.Action;
    setState({ CurrentPanel: currentPanel });
  }

  function GoToExportPanel() {
    let currentPanel = state.CurrentPanel;
    currentPanel = Panels.Export;
    setState({ CurrentPanel: currentPanel });
  }

  return (
    <div className="App">

      <sp-label>{Panels[state.CurrentPanel.valueOf()] + " Hi"}</sp-label>
      {state.CurrentPanel === Panels.Initialise && <InitPanel onFinished={GoToActionPanel} />}
      {state.CurrentPanel === Panels.Action && <ActionPanel onExport={GoToExportPanel}/>}
      {state.CurrentPanel === Panels.Export && <ExportPanel onFinished={GoToActionPanel}/>}

    </div>
  );
}
