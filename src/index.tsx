import '@babel/polyfill';
import React from 'react';
import { entrypoints } from 'uxp';
import { core } from 'photoshop';
import App from './App';
import PanelController from './Controllers/PanelController';
import { LoggingMenuItem, MainPanelInvokeMenu } from './typescript/MenuFlyout';


console.clear();

async function testFun() {
  await core.showAlert({ message: 'Running Test Function' });
}

// @ts-ignore
entrypoints.setup({
  commands: { test: testFun },
  panels: {
    MainPanel: PanelController(<App />, { menuItems: [LoggingMenuItem], invokeMenu: MainPanelInvokeMenu }),
  },
});
