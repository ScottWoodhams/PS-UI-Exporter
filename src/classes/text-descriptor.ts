import {RGBColor} from "photoshop/dom/objects/Colors";
import {Layer} from "photoshop/dom/Layer";


export class TextDescriptor {
    fontName: string;
    size: number;
    textKey: string;
    type: string;
    color: RGBColor;

    frameSize: number;
    frameColor: RGBColor;

    shadowAngle: number;
    shadowDistance: number;
    shadowColor: RGBColor;

    constructor(layer: Layer) {
        //Todo
    }
}
