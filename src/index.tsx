import "@babel/polyfill";
import React from "react";
import { entrypoints } from "uxp";
import { core } from "photoshop";
import App from "./App";
import PanelController from "./Controllers/PanelController";

async function testFun() {
  await core.showAlert({ message: "Running Test Function" });
}

entrypoints.setup({
  commands: { test: testFun },
  panels: {
    MainPanel: PanelController(<App />, { menuItems: [], invokeMenu: null })
  }
});
