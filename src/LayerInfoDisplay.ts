import {app} from "photoshop";
import {Layer} from "photoshop/dom/Layer";
import {Metadata, ReadMetaData} from "./metadata";
import { IsTexture } from "./Utilities";
import {Slices} from "./slices";


export async function UpdateDisplay(display: HTMLElement) {
  let info: string = "";
  let layer: Layer = app.activeDocument.activeLayers[0];

  if(layer !== null) {
    let meta: string = await ReadMetaData(layer.id);

    let data: Metadata;

    if(meta === undefined){
      data = new Metadata();
      data.ComponentName = "Not Component";
      data.Slices = Slices.Zero;
    }
    else
    {
      data = JSON.parse(meta);
    }

    let slices: string = data.Slices.Print;

    info = `
            Name: ${layer.name} <br />
            Kind: ${layer.kind} <br />
            Slices: ${slices} <br />
            IsTexture: ${IsTexture(layer)} <br />
            ${layer.kind} <br />`;
  }




  display.innerHTML = info;

}