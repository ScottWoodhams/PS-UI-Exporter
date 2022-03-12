import '@babel/polyfill';
import React, { useRef } from 'react';
import { entrypoints } from 'uxp';

import ReactDOM from 'react-dom';
import App from './App';
import PanelController from './Controllers/PanelController';
import MenuFlyout from './typescript/MenuFlyout';
import { RunTest } from './typescript/TestSuite';
import AuthPopup from './components/ComponentDialog';

console.clear();



async function testFun() {

}
entrypoints.setup({
  commands: { runTests: RunTest, test: testFun },
  panels: {
    MainPanel: PanelController(<App />, { ...MenuFlyout }),
  },
});
