import { SliceDescriptor } from "./slices";
import {TextDescriptor} from "./text-descriptor";
import {Layer} from "photoshop/dom/Layer";
import { GetExportType } from "../Utilities";
import { ExportType } from "../constants/export-type";


/*
    This is the data structure that will be exported as JSON
 */
export class UILayerData {

    Name: string;
    Bounds: any;
    Type: any;
    ComponentName: string;
    Slices: SliceDescriptor;
    Text: TextDescriptor;

    constructor() {

    }

    async Init(layer: Layer) {
        this.Name = layer.name;
        this.Bounds = layer.bounds;

        //Todo setup data getters
        this.Type = await GetExportType(layer);

        if(this.Type === ExportType.Image){
            this.Slices = SliceDescriptor.GetLayerSliceDescriptor(layer);
        }
        if(this.Type === ExportType.Text){
            this.Text = new TextDescriptor(layer);
        }
        if(this.Type === ExportType.Component){
            this.ComponentName = "";

        }

    }

}