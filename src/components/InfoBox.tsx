import React from 'react';
import Spectrum, { Divider } from 'react-uxp-spectrum';
import UILayerData from '../typescript/UILayerData';
import { TextDescriptor } from '../typescript/PSTypes';
import ColorField from './ColorField';

export type SliceRectProps = { data: UILayerData };

export default function InfoBox({ data }: SliceRectProps) {
  let outline;
  if (data.OutlineDescriptor !== undefined) {
    outline = JSON.stringify(data.OutlineDescriptor);
  }

  let shadow;
  if (data.ShadowDescriptor !== undefined) {
    shadow = JSON.stringify(data.ShadowDescriptor);
  }

  let text: TextDescriptor;
  if (data.TextDescriptor !== undefined) {
    text = data.TextDescriptor;
  }

  //todo add the missing data

  return (
    <div style={{flexFlow: "column"}}>
      <sp-heading>Layer Info</sp-heading>
      <sp-divider children={undefined} />
      <sp-label>Width: {data.Bounds.width}</sp-label>
      <sp-label>Height: {data.Bounds.height}</sp-label>


      {outline && <sp-label>{outline}</sp-label>}
      {shadow && <sp-label>{shadow}</sp-label>}
      {text && (
        <div style={{flexFlow: "column"}}>
          <sp-heading size={"S"}>Text</sp-heading>
          <sp-divider size={"small"} children={undefined}/>
          <sp-label>Size: {text.size}</sp-label>
          <sp-label>Font: {text.fontName}</sp-label>
          <ColorField Color={text.color}/>
        </div>
      )}
    </div>
  );
}
