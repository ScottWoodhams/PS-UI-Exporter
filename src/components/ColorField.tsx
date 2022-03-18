import { RGBColor } from 'photoshop';
import React from 'react';

export type ColorFieldProps = { Color: RGBColor };

export default function ColorField({ Color }: ColorFieldProps) {
  let hex = Color.hexValue;

  return (
      <div style={{display: "flex", flexFlow: "row"}}>
            <div className={'colorFieldSquare'} style={{background: Color.hexValue}}/>


      <sp-label> {hex} </sp-label>
      </div>
  );
}
