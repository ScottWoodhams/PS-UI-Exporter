import '@babel/polyfill';
import React from 'react';
import { entrypoints } from 'uxp';
import App from './App';
import PanelController from './Controllers/PanelController';
import MenuFlyout from './typescript/MenuFlyout';

console.clear();

entrypoints.setup({
  panels: {
    MainPanel: PanelController(<App />, { ...MenuFlyout }),
  },
});
