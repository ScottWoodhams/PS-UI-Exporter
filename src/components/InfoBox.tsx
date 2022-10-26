import React from 'react';
import Spectrum, { Divider } from 'react-uxp-spectrum';
import UILayerData from '../typescript/UILayerData';
import { DropShadowDescriptor, FrameFXDescriptor, TextDescriptor } from '../typescript/PSTypes';
import ColorField from './ColorField';

export type SliceRectProps = { data: UILayerData };

export default function InfoBox({ data }: SliceRectProps) {
  let outline: FrameFXDescriptor;
  if (data.OutlineDescriptor !== undefined) {
    outline = data.OutlineDescriptor;
  }

  let shadow: DropShadowDescriptor;
  if (data.ShadowDescriptor !== undefined) {
    shadow = data.ShadowDescriptor;
  }

  let text: TextDescriptor;
  if (data.TextDescriptor !== undefined) {
    text = data.TextDescriptor;
  }

  return (
    <div style={{ flexFlow: 'column' }}>
      <sp-heading>Layer Info</sp-heading>
      <sp-divider children={undefined} />
      <sp-label>Width: {data.Bounds.width}</sp-label>
      <br />
      <sp-label>Height: {data.Bounds.height}</sp-label>

      {outline && (
        <div style={{ flexFlow: 'column' }}>
          <sp-heading size={'S'}>Outline</sp-heading>
          <sp-divider size={'small'} children={undefined} />
          <sp-label>Size: {outline.size}</sp-label>
          <br />

          <ColorField Color={outline.color} />
        </div>
      )}

      {shadow && (
        <div style={{ flexFlow: 'column' }}>
          <sp-heading size='S'>Shadow</sp-heading>
          <sp-divider size="small" children={undefined} />
          <sp-label>Distance: {shadow.distance}</sp-label>
          <br />
          <sp-label>Angle: {shadow.angle}</sp-label>
          <ColorField Color={shadow.color} />
        </div>
      )}

      {text && (
        <div style={{ flexFlow: 'column' }}>
          <sp-heading size={'S'}>Text</sp-heading>
          <sp-divider size={'small'} children={undefined} />
          <sp-label>Size: {text.size}</sp-label>
          <br />
          <sp-label>Font: {text.fontName}</sp-label>
          <br />
          <ColorField Color={text.color} />
        </div>
      )}
    </div>
  );
}
