import { Slices } from "./slices";
import {TextDescriptor} from "./text-descriptor";
import {Layer} from "photoshop/dom/Layer";



export class UILayerData {

    Name: string;
    Bounds: any;
    Type: any;
    ComponentName: string;
    Slices: Slices;
    TextDescriptor: TextDescriptor;

    constructor(layer: Layer) {

        this.Name = layer.name;
        this.Bounds = layer.bounds;

        //Todo setup data getters
        this.Type = "Todo"
        this.ComponentName = "Todo"
        this.Slices = Slices.Zero;
        this.TextDescriptor = new TextDescriptor(layer);

    }

}