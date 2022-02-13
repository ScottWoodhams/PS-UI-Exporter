import { RGBColor } from 'photoshop';
import React from 'react';

export type ColorFieldProps = { Col: RGBColor };

export default function ColorField(props: ColorFieldProps) {

  const R = props.Col.red;
  const G = props.Col.green;
  const B = props.Col.blue;

  return (
    <div className="ColorField">
      <div className="ColorFieldSquare" style={{ backgroundColor: `rgb(${200}, ${G}, ${B})` }} />
      <sp-label>{props.Col.hexValue}</sp-label>
    </div>
  );
}
