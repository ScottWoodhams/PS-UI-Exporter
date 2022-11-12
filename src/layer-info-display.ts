import {app} from "photoshop";
import {Layer} from "photoshop/dom/Layer";
import {ReadMetaData} from "./metadata-functions";
import {GetExportType, GetLayerPosition, GetLayerSize} from "./Utilities";
import {Metadata} from "./classes/metadata";
import {ExportType} from "./constants/export-type";


export async function UpdateDisplay(display: HTMLElement) {
  let info: string = "";
  let layer: Layer = app.activeDocument.activeLayers[0];
  let baseInfo: string = "";
  let typeInfo: string = "";
  let meta: string = "";
  let data: Metadata = null;

  if(layer !== null) {

    meta = await ReadMetaData(layer.id);
    data = meta !== undefined ? JSON.parse(meta) :  new Metadata();

    let position: string = GetLayerPosition(layer)?.Print();
    let size: string = GetLayerSize(layer)?.Print();
    let exportAs = await GetExportType(layer);

    baseInfo = `
            Position: ${position} <br />
            Size: ${size} <br />
            Export As: ${exportAs} <br />        `;

    if(exportAs === ExportType.Image)
    {
      let slices: string = data.Slices?.Print();

      typeInfo = `        Slices: ${slices} <br />
      `;
    }
    if(exportAs === ExportType.Text){
      typeInfo = `
       Text Details
        
      `;
    }
    if(exportAs === ExportType.Component){
      typeInfo = `
        Component Details
        
      `;
    }

    info = baseInfo += typeInfo;

  }

  display.innerHTML = info;

}