import React, { useEffect } from 'react';
import Spectrum from 'react-uxp-spectrum';
import { action, app, core, Layer } from 'photoshop';

import { ApplySlices, InitSlices, SliceType } from '../typescript/SliceOperation';
import { Slices } from '../typescript/PSTypes';

export type SlicePanelProps = { onFinished: () => void; layer: Layer };

// todo show slice values in ui

export function SlicePanel({ onFinished, layer }: SlicePanelProps) {
  const events: string[] = [ "historyStateChanged", "close"];
  const [sliceType, onSliceTypeSelected] = React.useState(SliceType.None);
  const [guides, onGuidesUpdated] = React.useState({ top: 0, left: 0, bottom: 0, right: 0 });

  const ApplySlice = async () => {
    await ApplySlices(layer, sliceType);
    onFinished();
  };

  const Init = async () => {
    await InitSlices(layer);
  };

  const Cancel = async () =>{
    await core.executeAsModal(async () => {
      await app.activeDocument.closeWithoutSaving()
    }, { commandName: 'Closing document' });

  }

  function UpdateGuidesUI() {
    const slices: Slices = {
      top: app.activeDocument.guides[0].coordinate,
      left: app.activeDocument.guides[1].coordinate,
      bottom: app.activeDocument.guides[2].coordinate,
      right: app.activeDocument.guides[3].coordinate,
    };

    onGuidesUpdated(slices);
  }

  const eventHandler = (e, d) => {
    console.log(e, d);
    if (d.name === 'Drag Guide') {
      UpdateGuidesUI();
    }
    else if (e === 'close'){
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
    core.executeAsModal(Init, { commandName: 'Performing slice setup' });
    return () => {
      action.removeNotificationListener(events, eventHandler);
    };
  });

  return (
    <div>
      <sp-label> Top: {guides.top}</sp-label>

      <sp-heading size="S">Post-Slice Size</sp-heading>
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
