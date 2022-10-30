import {app} from "photoshop";
import { LayerKind } from "photoshop/dom/Constants";

/**
 * A function to compare two strings, compatible with {@link Array.prototype.sort}
 * @param a - the first string
 * @param b - the second string
 * @returns `-1` if `a < b`; `1` if `a > b` and `0` if neither is true
 */
function compareFn(a: string, b: string): number {
    if (a < b)
        return -1;
    else if (a > b)
        return 1;
    else
        return 0;
}

/**
 * @returns array of layer names
 */
export function getLayerNames(): string[] {
    const allLayers = app.activeDocument.layers;
    const allLayerNames: LayerKind[] = allLayers.map(layer => layer.kind);
    allLayerNames.sort(compareFn);

    return allLayerNames;
}
