import {app} from "photoshop";
import {WriteToMetaData} from "./metadata-functions";
import {Slices} from "./classes/slices";
import {Metadata} from "./classes/metadata";


export async function ComponentSetupInitialise() {
  let curLayer = app.activeDocument.activeLayers[0];
  let dullData: Metadata = new Metadata();
  dullData.ComponentName = "component test";
  dullData.Slices = new Slices(1,2,3,4)

  await WriteToMetaData(curLayer.id, dullData)
}

