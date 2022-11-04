import {action, app} from "photoshop";
import {LayerKind} from "photoshop/dom/Constants";
import {WriteToMetaData} from "./metadata";
import {Slices, UILayerData} from "./UILayerData";

export async function ComponentSetupInitialise() {
  let curLayer = app.activeDocument.activeLayers[0];
  let dullData: UILayerData = new UILayerData();
  dullData.ComponentName = "component test";
  dullData.Slices = new Slices(1,2,3,4)
  const content: string = JSON.stringify(dullData);

  await WriteToMetaData(curLayer.id, dullData)
}

