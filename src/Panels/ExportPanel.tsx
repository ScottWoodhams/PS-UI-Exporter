import { app } from 'photoshop';
import React, { useEffect, useState } from 'react';
import Spectrum from 'react-uxp-spectrum';
import { ExportProcess } from '../typescript/Export';
import { GetFonts, GetTextureCount } from '../typescript/Utilities';
import {
  ValidateNoEmptyLayers,
  ValidateSliceValues,
  ValidateTexts,
  ValidateTexturesNames,
} from '../typescript/Validation';

export type ExportPanelProps = { onFinished: () => void };

export function ExportPanel({ onFinished }: ExportPanelProps) {
  const [hasDupeLayerNames, UpdateDupeLayerNames] = useState(false);
  const [hasEmptyLayers, UpdateEmptyLayers] = useState(false);
  const [hasEmptyTextLayers, UpdateEmptyTextLayers] = useState(false);
  const [hasEmptySlices, UpdateEmptySlices] = useState(false);
  const [textureCount, UpdateTextureCount] = useState(0);
  const [fonts, UpdateFontCount] = useState([])

  async function Finish() {
    await ExportProcess();
    onFinished();
  }
  useEffect(() => {
    // todo add validation checks and is possible display a button to fix the issues
    async function RunValidation() {
      UpdateDupeLayerNames(await ValidateTexturesNames());
      UpdateEmptyLayers(await ValidateNoEmptyLayers());
      UpdateEmptyTextLayers(await ValidateTexts());
      UpdateEmptySlices(await ValidateSliceValues());
      UpdateTextureCount(await GetTextureCount());
      UpdateFontCount(await GetFonts());
    }
    RunValidation();
  });

  return (
    <div>
      <sp-heading> Validation</sp-heading>
      <sp-divider size={'small'} children={undefined} />
      <div className={"ValidationBox"}>
        <sp-label>Total Layers: {app.activeDocument.layers.length}</sp-label>
        <br/>
        <sp-label> Has Dupes: {hasDupeLayerNames ? 'true' : 'false'} </sp-label>
        <br/>

        <sp-label> Has Empty Layers: {hasEmptyLayers ? 'true' : 'false'} </sp-label>
        <sp-label> Has Empty Text Layers: {hasEmptyTextLayers ? 'true' : 'false'} </sp-label>
        <sp-label> Has Invalid Slices: {hasEmptySlices ? 'true' : 'false'} </sp-label>
      </div>
      {<sp-label> Texture count : {textureCount}</sp-label>}
      <br/>
      {<sp-label>Fonts: {fonts}</sp-label>}
      {/*<Spectrum.ActionButton onClick={Finish}> Start Export</Spectrum.ActionButton>*/}
    </div>
  );
}
