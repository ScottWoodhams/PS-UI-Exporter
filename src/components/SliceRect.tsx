import React from 'react';
import Spectrum from 'react-uxp-spectrum';
import { Rect, Slices, SliceType } from '../typescript/PSTypes';

export type SliceRectProps = { rect: Rect; slices: Slices; sliceType: SliceType };

export default function SliceRect({ rect, slices, sliceType }: SliceRectProps) {
  const size = `${rect.width}x${rect.height}`;
  const isSliced = sliceType !== 'None';

  const sliceTop = isSliced ? slices.top?.toString() : '';
  const sliceLeft = isSliced ? slices.left?.toString() : '';
  const sliceRight = isSliced ? slices.right?.toString() : '';
  const sliceBottom = isSliced ? slices.bottom?.toString() : '';

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Spectrum.Body size="M">Size: {size} </Spectrum.Body>

      <Spectrum.Body size="M">SliceType: {sliceType}</Spectrum.Body>

      <Spectrum.Body size="M">Top: {sliceTop}</Spectrum.Body>
      <Spectrum.Body size="M">Left: {sliceLeft}</Spectrum.Body>
      <Spectrum.Body size="M">Right: {sliceRight}</Spectrum.Body>
      <Spectrum.Body size="M">Bottom: {sliceBottom}</Spectrum.Body>
    </div>
  );
}
