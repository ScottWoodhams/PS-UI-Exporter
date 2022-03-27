import React, { useEffect } from 'react';
import Spectrum from 'react-uxp-spectrum';
import { action, app, core, Layer } from 'photoshop';

import { ApplySlices, InitSlices, SliceType } from '../typescript/SliceOperation';
import { Slices } from '../typescript/PSTypes';

export type SlicePanelProps = { onFinished: () => void; layer: Layer };

// todo show slice values in ui

export function SlicePanel({ onFinished, layer }: SlicePanelProps) {
  const events: string[] = ['historyStateChanged', 'close'];
  const [sliceType, onSliceTypeSelected] = React.useState(SliceType.None);
  const [guides, onGuidesUpdated] = React.useState({ top: 0, left: 0, bottom: 0, right: 0 });
  const [finalSize, updateFinalSize] = React.useState({ width: -1, height: -1 });

  const ApplySlice = async () => {
    await ApplySlices(layer, sliceType);
    onFinished();
  };

  const Init = async () => {
    await InitSlices(layer);
  };

  const Cancel = async () => {
    await core.executeAsModal(
      async () => {
        await app.activeDocument.closeWithoutSaving();
      },
      { commandName: 'Closing document' }
    );
  };

  function UpdateGuidesUI() {
    const slices: Slices = {
      top: app.activeDocument.guides[0].coordinate,
      left: app.activeDocument.guides[1].coordinate,
      bottom: app.activeDocument.guides[2].coordinate,
      right: app.activeDocument.guides[3].coordinate,
    };

    onGuidesUpdated(slices);
  }

  const GetFinalSize = () => {
    const slices: Slices = {
      top: app.activeDocument.guides[0].coordinate,
      left: app.activeDocument.guides[1].coordinate,
      bottom: app.activeDocument.guides[2].coordinate,
      right: app.activeDocument.guides[3].coordinate,
    };

    // todo should turn constant or expose to user
    const centerPixelSize = 8;
    const slicedHeight = slices.top + (app.activeDocument.height - slices.bottom) + centerPixelSize;
    const slicedWidth = slices.left + (app.activeDocument.width - slices.right) + centerPixelSize;

    updateFinalSize({ width: slicedWidth, height: slicedHeight });
  };

  const eventHandler = (e, d) => {
    console.log(e, d);
    if (d.name === 'Drag Guide') {
      UpdateGuidesUI();
      GetFinalSize();
    } else if (e === 'close') {
      onFinished();
    }
  };

  function onDropdownChange(selectedIndex: number) {
    let sliceType: SliceType;
    switch (selectedIndex) {
      case 0:
        sliceType = SliceType.None;
        break;
      case 1:
        sliceType = SliceType.Fill;
        break;
      case 2:
        sliceType = SliceType.Tiled;
        break;
      default:
        sliceType = SliceType.None;
    }

    onSliceTypeSelected(sliceType);
  }

  useEffect(() => {
    action.addNotificationListener(events, eventHandler);
    return () => {
      action.removeNotificationListener(events, eventHandler);
    };
  });

  return (
    <div>
      <sp-heading size="S"> How To</sp-heading>
      <Spectrum.Body size={"S"}>
        Drag guides to determine where the texture is sliced. Do not delete or make new guides"
      </Spectrum.Body>
      <div style={{ display: 'flex', flexFlow: 'column' }}>
        <sp-heading>Slice Details</sp-heading>
        <sp-divider children={undefined} />
        <sp-label> Top: {guides.top}</sp-label>
        <sp-label> Left: {guides.left}</sp-label>
        <sp-label> bottom: {guides.bottom}</sp-label>
        <sp-label> Right: {guides.right}</sp-label>
        <sp-label> Export Size: {`${finalSize.width.toString()}x${finalSize.height.toString()}`}</sp-label>
      </div>
      <Spectrum.Dropdown placeholder="Select Slice Type">
        <Spectrum.Menu selectedIndex={0} onChange={e => onDropdownChange(e.target.selectedIndex)}>
          <Spectrum.MenuItem> None </Spectrum.MenuItem>
          <Spectrum.MenuDivider />
          <Spectrum.MenuItem> Fill </Spectrum.MenuItem>
          <Spectrum.MenuItem> Tiled </Spectrum.MenuItem>
        </Spectrum.Menu>
      </Spectrum.Dropdown>
      <Spectrum.ActionButton onClick={Cancel}>Cancel</Spectrum.ActionButton>

      <Spectrum.ActionButton onClick={ApplySlice}>Slice</Spectrum.ActionButton>
    </div>
  );
}
