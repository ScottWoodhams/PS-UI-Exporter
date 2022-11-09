import { Slices } from "./slices";

export class Metadata {

    ComponentName: string;
    Slices: Slices;

    constructor(){
        this.ComponentName = "Not Component"
        this.Slices = Slices.Zero;
    }

}