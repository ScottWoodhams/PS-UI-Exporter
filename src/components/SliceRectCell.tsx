import React from 'react';
import '../App.css';

export type CellProps = {
  CSSClassName: string;
  Number?: string;
};

export default function SliceRectCell(props: CellProps) {
  return (
    <div className={props.CSSClassName}>
      <sp-detail weight="light" size="L">
        {props.Number}
      </sp-detail>
    </div>
  );
}
