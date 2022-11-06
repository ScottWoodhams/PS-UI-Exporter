import { Slices } from "./slices";
import {TextDescriptor} from "./text-descriptor";
import {Layer} from "photoshop/dom/Layer";



export class UILayerData {

    Name: string;
    Bounds: any;
    Type: any;
    ComponentName: string;
    Slices: Slices;
    TextData: TextDescriptor;

    constructor(layer: Layer) {



    }

}