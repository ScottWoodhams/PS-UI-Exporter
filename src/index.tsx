import '@babel/polyfill';
import React from 'react';
import { entrypoints } from 'uxp';
import { core } from 'photoshop';
import App from './App';
import PanelController from './Controllers/PanelController';
import {LoggingMenuItem, MainPanelInvokeMenu} from './typescript/MenuFlyout';
import { RunTest } from './typescript/TestSuite';

console.clear();

async function testFun() {
  await core.showAlert({ message: 'Running Test Function' });
}

entrypoints.setup({
  commands: { runTests: RunTest, test: testFun },
  panels: {
    MainPanel: PanelController(<App />, { menuItems: [ LoggingMenuItem ], invokeMenu: MainPanelInvokeMenu})
  }
});
