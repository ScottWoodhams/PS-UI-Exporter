import React from 'react';
import { TextDescriptor } from '../typescript/PSTypes';
import ColorField from './ColorField';

type TextDetailsProps = { desc: TextDescriptor };

export default function TextDetails({ desc }: TextDetailsProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <sp-label>Size: {desc.size}</sp-label>
      <sp-label>Type:{desc.type}</sp-label>
      <sp-label>Font:{desc.fontName}</sp-label>
      <ColorField Col={desc.color} />
    </div>
  );
}
