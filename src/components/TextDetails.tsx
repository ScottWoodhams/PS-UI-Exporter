
import React from 'react';
import { RGBToHex } from "../typescript/Utilities";

export default function TextDetails({ desc }) {
  let hexString = RGBToHex(desc.red, desc.grain, desc.blue);


  return (
    <div>
      <sp-label>{desc.size._value}</sp-label>
      <sp-label>{desc.type._value}</sp-label>
      <sp-label>{hexString}</sp-label>
    </div>
  );
}
