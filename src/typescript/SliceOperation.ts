import { action, app, core, Document, DocumentCreateOptions, Layer } from 'photoshop';
import { Slices } from './PSTypes';
import * as PSTypes from './PSTypes';
import { UpdateMetaProperty } from './Metadata';

export enum SliceType {
  None = 'None',
  Fill = 'Fill',
  Tiled = 'Tiled',
}

export enum Anchor {
  AnchorN = 'QCSSide0',
  AnchorW = 'QCSSide3',
  AnchorNW = 'QCSCorner0',
}

interface PercentDelta {
  Width: number;
  Height: number;
}

interface Translation {
  Width: number;
  Height: number;
  XDelta: number;
  YDelta: number;
  Anchor: Anchor;
}

async function GetPercentDelta(CenterPixelSize: number, Rect: Slices): Promise<PercentDelta> {
  const widthPercentDelta = (CenterPixelSize / (Rect.right - Rect.left)) * 100;
  const heightPercentDelta = (CenterPixelSize / (Rect.bottom - Rect.top)) * 100;
  return { Width: widthPercentDelta, Height: heightPercentDelta };
}

export async function Select(Bounds: Slices) {
  try {
    await action.batchPlay(
      [
        {
          _obj: 'set',
          _target: [{ _ref: 'channel', _property: 'selection' }],
          to: {
            _obj: 'rectangle',
            top: { _unit: 'pixelsUnit', _value: Bounds.top },
            left: { _unit: 'pixelsUnit', _value: Bounds.left },
            bottom: { _unit: 'pixelsUnit', _value: Bounds.bottom },
            right: { _unit: 'pixelsUnit', _value: Bounds.right },
          },
          feather: {
            _unit: 'pixelsUnit',
            _value: 0,
          },
          _isCommand: false,
          _options: { dialogOptions: 'dontDisplay' },
        },
      ],
      {}
    );
  } catch (e) {
    console.log(e);
  }
}

export async function Deselect(id: number) {
  try {
    await action.batchPlay(
      [
        {
          _obj: 'set',
          _target: [
            { _ref: 'channel', _property: 'selection' },
            { _ref: 'document', _id: id },
          ],
          to: { _enum: 'ordinal', _value: 'none' },
          _isCommand: false,
          _options: { dialogOptions: 'dontDisplay' },
        },
      ],
      {}
    );
  } catch (e) {
    console.log(e);
  }
}

export async function TranslateSelection(Translation: Translation) {
  try {
    await action.batchPlay(
      [
        {
          _obj: 'transform',
          _target: [{ _ref: 'layer', _enum: 'ordinal', _value: 'targetEnum' }],
          freeTransformCenterState: { _enum: 'quadCenterState', _value: Translation.Anchor },
          offset: {
            _obj: 'offset',
            horizontal: { _unit: 'pixelsUnit', _value: Translation.XDelta },
            vertical: { _unit: 'pixelsUnit', _value: Translation.YDelta },
          },
          width: { _unit: 'percentUnit', _value: Translation.Width },
          height: { _unit: 'percentUnit', _value: Translation.Height },
          interfaceIconFrameDimmed: { _enum: 'interpolationType', _value: 'nearestNeighbor' },
          _isCommand: false,
          _options: { dialogOptions: 'dontDisplay' },
        },
      ],
      {}
    );
  } catch (e) {
    console.log(e);
  }
}

async function SelectAndTranslate(Bounds: Slices, Translation: Translation, DocID: number) {
  await Select(Bounds);
  await TranslateSelection(Translation);
  await Deselect(DocID);
}

export async function ExecuteSlice(
  Slices: Slices,
  CanvasWidth: number,
  CanvasHeight: number,
  DocID: number,
  CenterPixelSize: number
) {
  const ZO = 0;
  const ST = Slices.top;
  const SL = Slices.left;
  const SR = Slices.right;

  const SB = Slices.bottom;
  const CH = CanvasHeight;
  const CW = CanvasWidth;

  // const NW: Slices = { top: ZO, left: ZO, bottom: ST, right: SL };
  const NN: Slices = { top: ZO, left: SL, bottom: ST, right: SR };
  const NE: Slices = { top: ZO, left: SR, bottom: ST, right: CW };

  const WW: Slices = { top: ST, left: ZO, bottom: SB, right: SL };
  const CB: Slices = { top: ST, left: SL, bottom: SB, right: SR };
  const EE: Slices = { top: ST, left: SR, bottom: SB, right: CW };

  const SW: Slices = { top: SB, left: ZO, bottom: CH, right: SL };
  const SS: Slices = { top: SB, left: SL, bottom: CH, right: SR };
  const SE: Slices = { top: SB, left: SR, bottom: CH, right: CW };

  const NNPercent: PercentDelta = await GetPercentDelta(CenterPixelSize, NN);
  const NTranslation: Translation = {
    Width: NNPercent.Width,
    Height: 100,
    XDelta: 0,
    YDelta: 0,
    Anchor: Anchor.AnchorW,
  };

  const WWPercent: PercentDelta = await GetPercentDelta(CenterPixelSize, WW);
  const WTranslation: Translation = {
    Width: 100,
    Height: WWPercent.Height,
    XDelta: 0,
    YDelta: 0,
    Anchor: Anchor.AnchorN,
  };

  const CPercent: PercentDelta = await GetPercentDelta(CenterPixelSize, CB);
  const CTranslation: Translation = {
    Width: CPercent.Width,
    Height: CPercent.Height,
    XDelta: 0,
    YDelta: 0,
    Anchor: Anchor.AnchorNW,
  };

  await SelectAndTranslate(NN, NTranslation, DocID);
  await SelectAndTranslate(WW, WTranslation, DocID);
  await SelectAndTranslate(CB, CTranslation, DocID);

  const CenterWidth = SR - SL;
  const CenterHeight = SB - ST;

  const XMove = -(CenterWidth - CenterPixelSize);
  const YMove = -(CenterHeight - CenterPixelSize);

  const EPercent: PercentDelta = await GetPercentDelta(CenterPixelSize, EE);
  const ETranslation: Translation = {
    Width: 100,
    Height: EPercent.Height,
    XDelta: XMove,
    YDelta: 0,
    Anchor: Anchor.AnchorN,
  };

  const SPercent: PercentDelta = await GetPercentDelta(CenterPixelSize, EE);
  const STranslation: Translation = {
    Width: SPercent.Width,
    Height: 100,
    XDelta: 0,
    YDelta: YMove,
    Anchor: Anchor.AnchorNW,
  };

  const NETranslation: Translation = { Width: 100, Height: 100, XDelta: XMove, YDelta: 0, Anchor: Anchor.AnchorW };
  const SWTranslation: Translation = { Width: 100, Height: 100, XDelta: 0, YDelta: YMove, Anchor: Anchor.AnchorN };
  const SETranslation: Translation = { Width: 100, Height: 100, XDelta: XMove, YDelta: YMove, Anchor: Anchor.AnchorNW };

  await SelectAndTranslate(EE, ETranslation, DocID);
  await SelectAndTranslate(SS, STranslation, DocID);
  await SelectAndTranslate(NE, NETranslation, DocID);
  await SelectAndTranslate(SW, SWTranslation, DocID);
  await SelectAndTranslate(SE, SETranslation, DocID);
  await app.activeDocument.trim('transparent', true, true, true, true);
}

export async function ApplySlices(layer: Layer, sliceType: SliceType) {
  const topGuide = app.activeDocument.guides[0];
  const leftGuide = app.activeDocument.guides[1];
  const bottomGuide = app.activeDocument.guides[2];
  const rightGuide = app.activeDocument.guides[3];

  const { id } = layer;
  const slices: PSTypes.Slices = {
    top: topGuide.coordinate,
    left: leftGuide.coordinate,
    bottom: bottomGuide.coordinate,
    right: rightGuide.coordinate,
  };

  await core.executeAsModal(async () => app.activeDocument.closeWithoutSaving(), { commandName: 'closing document' });

  await core.executeAsModal(async () => UpdateMetaProperty(id, 'Slices', slices), {
    commandName: 'Updating slice property',
  });

  await core.executeAsModal(async () => UpdateMetaProperty(id, 'SliceType', sliceType), {
    commandName: 'Updating slice property',
  });
}

export async function InitSlices(layer: Layer) {
  const options: DocumentCreateOptions = {
    typename: 'NewDocument',
    fill: 'transparent',
    height: app.activeDocument.height,
    mode: 'RGBColorMode',
    name: 'Slice Image',
    resolution: app.activeDocument.resolution,
    width: app.activeDocument.width,
  };

  const exportDocument: Document = await app.createDocument(options);

  const duplicatedLayer: Layer = await layer.duplicate(exportDocument, 'placeAtBeginning');

  await duplicatedLayer.rasterize('entire');
  await exportDocument.trim('transparent', true, true, true, true);

  exportDocument.guides.add('horizontal', 0);
  exportDocument.guides.add('vertical', 0);
  exportDocument.guides.add('horizontal', exportDocument.height);
  exportDocument.guides.add('vertical', exportDocument.width);
}
