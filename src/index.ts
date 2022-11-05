import {SliceSetupInitialise} from "./slice-setup";
import {ComponentSetupInitialise} from "./componentsetup";
import {RunExport} from "./export-process";
import {UpdateDisplay} from "./LayerInfoDisplay";

// HTML Element setup

console.clear()
console.log("Rebuilt")

const btnSlice: HTMLElement = document.getElementById("btnSlice");
btnSlice.addEventListener("click", SliceSetupInitialise);

const btnSetComponent: HTMLElement = document.getElementById("btnSetComponent");
btnSetComponent.addEventListener("click", ComponentSetupInitialise);

const btnSetExport: HTMLElement = document.getElementById("btnExport");
btnSetExport.addEventListener("click", RunExport);


const layerInfoBox: HTMLElement = document.getElementById("layerInfoBox");


//Event Listening
const listener = async (event: string, data: any) => {
  if (event === "select") {
    //await UpdateDisplay(layerInfoBox);
  }
  console.log(event, data);
};

require('photoshop').action.addNotificationListener([
  {
    event: "select"
  },
  {
    event: "open"
  }
], listener);

