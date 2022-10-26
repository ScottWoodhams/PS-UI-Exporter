import { action, ActionDescriptor } from 'photoshop';
import { GetMetaProperty } from './Metadata';
import * as PSTypes from './PSTypes';

import { ColorDescToColorObj, EmptyColor, RectangleToRect } from './Utilities';

export default class UILayerData {
  Name: string;

  Bounds: PSTypes.Rect;

  LayerType: PSTypes.LayerType;

  Component: string;

  Slices?: PSTypes.Slices;

  SliceType?: PSTypes.SliceType;

  TextDescriptor?: PSTypes.TextDescriptor;

  OutlineDescriptor?: PSTypes.FrameFXDescriptor;

  ShadowDescriptor?: PSTypes.DropShadowDescriptor;

  constructor() {
    this.Name = 'N/A';
    this.LayerType = 'None';
    this.Bounds = { top: 0, left: 0, right: 0, width: 0, height: 0, bottom: 0 };
    this.Component = 'N/A';
    this.Slices = <PSTypes.Slices>{ bottom: 0, left: 0, right: 0, top: 0 };
    this.SliceType = 'None';
    this.TextDescriptor = undefined;
    this.OutlineDescriptor = undefined;
    this.ShadowDescriptor = undefined;
  }
}

export async function LayerDataInit(LayerID: number): Promise<UILayerData> {
  const LayerData: UILayerData = new UILayerData();

  const layerProps = ['name', 'layerKind', 'bounds', 'layerFXVisible', 'textKey', 'layerEffects', 'metaData'];

  const command = {
    _obj: 'multiGet',
    _target: {
      _ref: [
        { _ref: 'layer', _id: LayerID },
        { _ref: 'document', _enum: 'ordinal' },
      ],
    },
    extendedReference: [layerProps],
    options: { failOnMissingProperty: false, failOnMissingElement: false },
  };

  const actionDescriptors: ActionDescriptor[] = await action.batchPlay([command], {});
  const props: ActionDescriptor = actionDescriptors[0];

  LayerData.Name = props.name;
  LayerData.Bounds = RectangleToRect(props.bounds);

  if (props.layerKind === 'text') {
    LayerData.TextDescriptor = {
      fontName: props.textKey.textStyleRange[0].textStyle.fontName,
      size: props.textKey.textStyleRange[0].textStyle.size._value,
      textKey: props.textKey.textKey,
      type: props.textKey.textShape[0].char._value,
      color: await ColorDescToColorObj(props.textKey.textStyleRange[0].textStyle.color),
    };
  }

  if (props.layerEffects !== undefined) {
    const hasOutline = props.layerEffects.frameFX !== undefined;

    LayerData.OutlineDescriptor = {
      size: hasOutline ? props.layerEffects.frameFX.size._value : 0,
      color: hasOutline ? await ColorDescToColorObj(props.layerEffects.frameFX.color) : EmptyColor,
    };

    const hasDropShadow = props.layerEffects.dropShadow !== undefined;

    LayerData.ShadowDescriptor = {
      angle: hasDropShadow ? props.layerEffects.dropShadow.localLightingAngle._value : 0,
      distance: hasDropShadow ? props.layerEffects.dropShadow.distance._value : 0,
      color: hasDropShadow ? await ColorDescToColorObj(props.layerEffects.dropShadow.color) : EmptyColor,
    };
  }

  // get the user-written metadata if it exists
  if (props.metaData) {
    LayerData.LayerType = (await GetMetaProperty(LayerID, 'LayerType')) as PSTypes.LayerType;
    LayerData.Component = (await GetMetaProperty(LayerID, 'Component')) as string;
    LayerData.SliceType = (await GetMetaProperty(LayerID, 'SliceType')) as PSTypes.SliceType;
    LayerData.Slices = (await GetMetaProperty(LayerID, 'Slices')) as PSTypes.Slices;
  } else {
    LayerData.LayerType = 'None';
    LayerData.Component = '';
    LayerData.SliceType = 'None';
    LayerData.Slices = undefined;
  }

  return LayerData;
}
