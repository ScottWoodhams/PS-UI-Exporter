import {SliceSetupInitialise} from "./slice-setup";
import {ComponentSetupInitialise} from "./componentsetup";
import {RunExport} from "./export-process";

// HTML Element setup


const btnSlice: HTMLElement = document.getElementById("btnSlice");
btnSlice.addEventListener("click", SliceSetupInitialise);

const btnSetComponent: HTMLElement = document.getElementById("btnSetComponent");
btnSetComponent.addEventListener("click", ComponentSetupInitialise);

const btnSetExport: HTMLElement = document.getElementById("btnExport");
btnSetExport.addEventListener("click", RunExport);


const layerInfoBox: HTMLElement = document.getElementById("layerInfoBox");
if(layerInfoBox){
  layerInfoBox.innerHTML = `<ul>${"No  Selected"}</ul>`

}
