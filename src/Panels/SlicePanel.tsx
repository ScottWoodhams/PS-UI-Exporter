import React, { useEffect } from 'react';
import Spectrum from 'react-uxp-spectrum';
import { action, app, core, Layer } from 'photoshop';

import { ApplySlices, InitSlices, SliceType } from '../typescript/SliceOperation';
import Spectrum from "react-uxp-spectrum/dist/Menu";
import MenuEvent = Spectrum.MenuEvent;

export type SlicePanelProps = { onFinished: () => void; layer: Layer };

// todo improve ui
// todo show slice values in ui
// todo pick slice type

export function SlicePanel({ onFinished, layer }: SlicePanelProps) {
  const events: string[] = ['select'];
  const [sliceType, onSliceTypeSelected] = React.useState(SliceType.None);

  const ApplySlice = async () => {
    await ApplySlices(layer, sliceType);
    onFinished();
  };

  const Exit = async () => {
    await app.activeDocument.closeWithoutSaving();
    onFinished();
  };

  const Init = async () => {
    await InitSlices(layer);
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
    action.addNotificationListener(events, Exit);
    core.executeAsModal(Init, { commandName: 'Performing slice setup' });
    return () => {
      action.removeNotificationListener(events, Exit);
    };
  });

  return (
    <div>
      <sp-heading size="S">Post-Slice Size</sp-heading>
      <Spectrum.Dropdown placeholder="Select Slice Type">
        <Spectrum.Menu selectedIndex={0} onChange={(e: MenuEvent) => onDropdownChange(e.target.selectedIndex)}>
          <Spectrum.MenuItem> None </Spectrum.MenuItem>
          <Spectrum.MenuDivider children={undefined} />
          <Spectrum.MenuItem> Fill </Spectrum.MenuItem>
          <Spectrum.MenuItem> Tiled </Spectrum.MenuItem>
        </Spectrum.Menu>
      </Spectrum.Dropdown>

      <Spectrum.ActionButton onClick={ApplySlice}>Slice</Spectrum.ActionButton>
    </div>
  );
}
