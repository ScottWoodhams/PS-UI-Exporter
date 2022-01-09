import { action, ActionDescriptor, Layer, LayerKindConsts } from 'photoshop';
import { GetMetaProperty } from './Metadata';
import * as PSTypes from './PSTypes';
import { RectangleToRect } from './Utilities';

export default class UILayerData {
  Name: string;
  LayerType: LayerKindConsts;
  Bounds: PSTypes.Rect;
  HasLayerEffects: boolean;
  IsComponent: boolean;
  Component: string;
  Slices?: PSTypes.Slices;
  SliceType?: PSTypes.SliceType;
  TextDescriptor?: PSTypes.TextDescriptor;
  OutlineDescriptor?: PSTypes.FrameFXDescriptor;
  ShadowDescriptor?: PSTypes.DropShadowDescriptor;


  constructor(layer?: Layer) {
    this.Name = 'N/A';
    this.LayerType = layer.kind;
    this.Bounds = layer.bounds;
    this.HasLayerEffects = false;
    this.IsComponent = false;
    this.Component = 'N/A';
    this.Slices = <PSTypes.Slices>{ bottom: 0, left: 0, right: 0, top: 0 };
    this.SliceType = 'None';
    this.TextDescriptor = undefined;
    this.OutlineDescriptor = undefined;
    this.ShadowDescriptor = undefined;
  }
}

export async function LayerDataInit(LayerData: UILayerData, LayerID: number) {
  const layerProps = ['name', 'bounds', 'layerFXVisible', 'textKey', 'layerEffects', 'metaData'];

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
  LayerData.LayerType = props.layerKind;
  LayerData.HasLayerEffects = props.layerFXVisible === true;

  if (LayerData.LayerType === 'text') {
    LayerData.TextDescriptor = {
      fontName: props.textKey.textStyleRange[0].textStyle.fontName,
      size: props.textKey.textStyleRange[0].textStyle.size,
      textKey: props.textKey.textKey,
      type: props.textKey.textShape[0].char,
      color: props.textKey.textStyleRange[0].textStyle.color,
    };
  }

  if (LayerData.HasLayerEffects) {
    LayerData.OutlineDescriptor = props.layerEffects.frameFX;
    LayerData.ShadowDescriptor = props.layerEffects.dropShadow;
  }

  // get the user-written metadata if it exists
  if (props.metaData) {
    LayerData.IsComponent = await GetMetaProperty(LayerID, 'IsComponent');
    LayerData.Component = await GetMetaProperty(LayerID, 'Component');
    LayerData.SliceType = await GetMetaProperty(LayerID, 'SliceType');
    LayerData.Slices = await GetMetaProperty(LayerID, 'Slices');
  } else {
    LayerData.IsComponent = false;
    LayerData.Component = '';
    LayerData.SliceType = 'None';
    LayerData.Slices = undefined;
  }
}
