import React from 'react';
import Spectrum, { Divider } from 'react-uxp-spectrum';

export type SliceRectProps = { data: unknown; title: string };

export default function InfoBox({ data, title }: SliceRectProps) {
  let rectString;
  if (data !== null) {
    rectString = JSON.stringify(data, undefined, 4);
    if (rectString !== undefined) {
      rectString = rectString.replace('{', '');
      rectString = rectString.replace('}', '');
      rectString = rectString.replaceAll('"', '');
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100px' }}>
      <Spectrum.Heading>{title}</Spectrum.Heading>
      <Divider size="large" />
      <sp-textarea disabled style={{ height: '100px' }}>
        {rectString}
      </sp-textarea>
    </div>
  );
}
