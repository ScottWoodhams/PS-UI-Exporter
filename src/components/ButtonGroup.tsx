import React from 'react';
import Spectrum from 'react-uxp-spectrum';

export default function ButtonGroup() {
  return (
    <div>
        <Spectrum.ActionButton> Slice </Spectrum.ActionButton>
        <Spectrum.ActionButton> Component </Spectrum.ActionButton>
        <Spectrum.ActionButton> Export </Spectrum.ActionButton>
    </div>
  );
}
