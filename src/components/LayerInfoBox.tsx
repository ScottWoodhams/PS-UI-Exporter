import React, { useEffect, useState } from "react";

import { action, app } from "photoshop";
// eslint-disable-next-line import/no-unresolved
import { LayerKind } from "photoshop/dom/Constants";
import { GetExportedLayerType } from "../typescript/Utilites";

export default function LayerInfoBox() {
  const [curLayerData, setCurrentLayerData] = useState("");

  function formatData() {
    const curLayer = app.activeDocument.activeLayers[0];
    const exportedLayerType: string = GetExportedLayerType(curLayer.kind);
    return curLayer.name + exportedLayerType;
  }

  const eventHandler = (event, data) => {
    if (event === "select") {
      setCurrentLayerData(formatData());
      console.log(app.activeDocument.activeLayers[0]);
    }
  };

  const events: string[] = ["select"];
  useEffect(() => {
    action.addNotificationListener(events, eventHandler);
    return () => {
      action.removeNotificationListener(events, eventHandler);
    };
  });

  return (
    <div className="LayerInfoBox">
      <sp-detail>{curLayerData}</sp-detail>
    </div>
  );
}
