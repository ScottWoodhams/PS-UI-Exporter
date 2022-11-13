import { SliceDescriptor } from "./slices";

/*
    This class defines the data that is stored in the layer
 */
export class Metadata {

    ComponentName: string;
    Slices: SliceDescriptor;

    constructor(){
        this.ComponentName = "Not Component"
        this.Slices = SliceDescriptor.Zero;
    }

}