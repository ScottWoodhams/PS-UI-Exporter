import React from "react";
import Spectrum from "react-uxp-spectrum";
import { InitPanelProps } from "./InitPanel";

export type ExportPanelProps = { onFinished: () => void };

export function ExportPanel({ onFinished }: ExportPanelProps){

  async function Finish() {
    onFinished();
  }

  return (
    <div>
      <sp-heading>Export Panel</sp-heading>
      <Spectrum.ActionButton onClick={Finish}>Finish</Spectrum.ActionButton>
    </div>
  )
}