// @ts-ignore
import {action, app, Direction, Document, DocumentCreateOptions, Layer, Orientation} from "photoshop"


export function ExecuteExport() {
    const layerCount: number = app.activeDocument.layers.length;
    console.log("Execute Export on " + layerCount + " layers");
}