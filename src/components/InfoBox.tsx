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
    <div style={{ display: 'flex', flexDirection: 'column', height: '150px' }}>
      <Spectrum.Heading style={{ marginBottom: 20}}>{title}</Spectrum.Heading>
      <Divider size="large" />
      <sp-textarea disabled style={{ height: '100%' }}>
        {rectString}
      </sp-textarea>
    </div>
  );
}
