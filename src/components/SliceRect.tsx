import React from 'react';
import SliceRectCell from './SliceRectCell';
import { Bounds } from 'photoshop/dom/objects/Bounds';
import { RectProps, Slices } from '../typescript/PSTypes';

export default function SliceRect({ rect, slices, sliceType }) {
  console.log('rectProps: ' + slices);

  const size = `${rect.width}x${rect.height}`;
  const isSliced = sliceType !== 'None';

  const sliceTop = isSliced ? slices.top.toString() : '';
  const sliceLeft = isSliced ? slices.left.toString() : '';
  const sliceRight = isSliced ? slices.right.toString() : '';
  const sliceBottom = isSliced ? slices.bottom.toString() : '';

  return (
    <div>
      <sp-label>{sliceType}</sp-label>
      <div className="SliceRect">
        <SliceRectCell CSSClassName="SliceCellTopLeft" />
        <SliceRectCell CSSClassName="SliceCellTopMiddle" Number={sliceTop} />
        <SliceRectCell CSSClassName="SliceCellTopRight" />
        <SliceRectCell CSSClassName="SliceCellMiddleLeft" Number={sliceLeft} />
        <SliceRectCell CSSClassName="SliceCellMiddle" Number={size} />
        <SliceRectCell CSSClassName="SliceCellMiddleRight" Number={sliceRight} />
        <SliceRectCell CSSClassName="SliceCellLowerLeft" />
        <SliceRectCell CSSClassName="SliceCellLowerMiddle" Number={sliceBottom} />
        <SliceRectCell CSSClassName="SliceCellLowerRight" />
      </div>
    </div>
  );
}
