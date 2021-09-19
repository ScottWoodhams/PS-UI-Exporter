"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecuteExport = void 0;
// @ts-ignore
const photoshop_1 = require("photoshop");
function ExecuteExport() {
    const layerCount = photoshop_1.app.activeDocument.layers.length;
    console.log("Execute Export on " + layerCount + " layers");
}
exports.ExecuteExport = ExecuteExport;
//# sourceMappingURL=ExportProcess.js.map