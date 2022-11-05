import {app} from "photoshop";
import {Layer} from "photoshop/dom/Layer";
import {ReadMetaData} from "./metadata";
import {Slices, UILayerData} from "./UILayerData";
import { IsTexture } from "./Utilities";


export async function UpdateDisplay(display: HTMLElement) {
  let info: string = "";
  let layer: Layer = app.activeDocument.activeLayers[0];

  if(layer !== null){
    let meta: string = await ReadMetaData(layer.id);
    let data: UILayerData = JSON.parse(meta);
    let slices = data.Slices ?  Slices.Zero().Print() : data.Slices.Print();

    info = `
            ${layer.name} <br />
            ${layer.kind} <br />
            ${slices} <br />
            ${data.ComponentName} <br />
            ${layer.kind} <br />`;
  }




  display.innerHTML = info;

}