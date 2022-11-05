import { walkActionThroughLayers } from "./Utilities";
import { app } from "photoshop";


export function RunExport(){
walkActionThroughLayers(app.activeDocument, (layer) => {

  // create json object
  let layerData = {

  }


})


}