import '@babel/polyfill';
import React from 'react';
import { entrypoints } from 'uxp';
import { app, core, action } from 'photoshop';
import * as uxp from 'uxp';
import App from './App';
import PanelController from './Controllers/PanelController';
import MenuFlyout from './typescript/MenuFlyout';
import { RunTest } from './typescript/TestSuite';

console.clear();

async function targetFunction() {}

async function testFun() {
  await core.executeAsModal(targetFunction, { commandName: 'User Cancel Test' });
}

entrypoints.setup({
  commands: { runTests: RunTest, test: testFun },
  panels: {
    MainPanel: PanelController(<App />, { ...MenuFlyout }),
  },
});
