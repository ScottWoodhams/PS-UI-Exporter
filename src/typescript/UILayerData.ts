import { action, ActionDescriptor } from 'photoshop';
import { GetMetaProperty } from './Metadata';
import * as PSTypes from './PSTypes';
import { ELayerType } from './PSTypes';
import { ColorDescToColorObj, EmptyColor, RectangleToRect } from './Utilities';
import { Log, LogLevel } from './Logger';

export default class UILayerData {
  Name: string;

  LayerType: ELayerType;

  Bounds: PSTypes.Rect;

  IsComponent: boolean;

  Component: string;

  Slices?: PSTypes.Slices;

  SliceType?: PSTypes.SliceType;

  TextDescriptor?: PSTypes.TextDescriptor;

  OutlineDescriptor?: PSTypes.FrameFXDescriptor;

  ShadowDescriptor?: PSTypes.DropShadowDescriptor;

  constructor() {
    this.Name = 'N/A';
    this.LayerType = ELayerType.pixel;
    this.Bounds = { top: 0, left: 0, right: 0, width: 0, height: 0, bottom: 0 };
    this.IsComponent = false;
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

  await Log(LogLevel.Info, `Initialising layer "${props.Name}`);

  LayerData.Name = props.name;
  LayerData.Bounds = RectangleToRect(props.bounds);
  await Log(LogLevel.Info, `Layer ${props.Name} Bounds "${LayerData.Bounds}`);

  LayerData.LayerType = ELayerType[ELayerType[props.layerKind]];
  await Log(LogLevel.Info, `Layer ${props.Name} Bounds "${LayerData.LayerType}`);

  if (LayerData.LayerType === ELayerType.text) {
    await Log(LogLevel.Info, `Layer ${props.Name} is classed as text`);

    LayerData.TextDescriptor = {
      fontName: props.textKey.textStyleRange[0].textStyle.fontName,
      size: props.textKey.textStyleRange[0].textStyle.size._value,
      textKey: props.textKey.textKey,
      type: props.textKey.textShape[0].char._value,
      color: await ColorDescToColorObj(props.textKey.textStyleRange[0].textStyle.color),
    };
  }

  if (props.layerEffects !== undefined) {
    await Log(LogLevel.Info, `Layer ${props.Name} has LayerEffects`);

    const hasOutline = props.layerEffects.frameFX !== undefined;
    await Log(LogLevel.Info, `Layer ${props.Name} has outline: ${hasOutline}`);

    LayerData.OutlineDescriptor = {
      size: hasOutline ? props.layerEffects.frameFX.size._value : 0,
      color: hasOutline ? await ColorDescToColorObj(props.layerEffects.frameFX.color) : EmptyColor,
    };

    const hasDropShadow = props.layerEffects.dropShadow !== undefined;
    await Log(LogLevel.Info, `Layer ${props.Name} has dropShadow: ${hasDropShadow}`);

    LayerData.ShadowDescriptor = {
      angle: hasDropShadow ? props.layerEffects.dropShadow.localLightingAngle._value : 0,
      distance: hasDropShadow ? props.layerEffects.dropShadow.distance._value : 0,
      color: hasDropShadow ? await ColorDescToColorObj(props.layerEffects.dropShadow.color) : EmptyColor,
    };
  }

  // get the user-written metadata if it exists
  if (props.metaData) {
    await Log(LogLevel.Info, `Layer ${props.Name} already has metaData`);

    LayerData.IsComponent = (await GetMetaProperty(LayerID, 'IsComponent')) as boolean;
    LayerData.Component = (await GetMetaProperty(LayerID, 'Component')) as string;
    LayerData.SliceType = (await GetMetaProperty(LayerID, 'SliceType')) as PSTypes.SliceType;
    LayerData.Slices = (await GetMetaProperty(LayerID, 'Slices')) as PSTypes.Slices;
  } else {
    await Log(LogLevel.Info, `Layer ${props.Name} does not already have metaData`);
    LayerData.IsComponent = false;
    LayerData.Component = '';
    LayerData.SliceType = 'None';
    LayerData.Slices = undefined;
  }

  return LayerData;
}
