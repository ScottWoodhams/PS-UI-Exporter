import {app} from "photoshop";
import {Metadata, WriteToMetaData} from "./metadata";
import {Slices} from "./slices";


export async function ComponentSetupInitialise() {
  let curLayer = app.activeDocument.activeLayers[0];
  let dullData: Metadata = new Metadata();
  dullData.ComponentName = "component test";
  dullData.Slices = new Slices(1,2,3,4)

  await WriteToMetaData(curLayer.id, dullData)
}

