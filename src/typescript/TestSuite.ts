import { action, app, core, DocumentCreateOptions, ExecutionContext } from 'photoshop';
import { InitLayers } from './Metadata';
import { ApplySlices, InitSlices } from './SliceOperation';
import { ExportProcess } from './Export';

export async function CreateNewDocument() {
  const options: DocumentCreateOptions = {
    width: 500,
    height: 600,
    resolution: 300,
    mode: 'RGBColorMode',
    fill: 'transparent',
  };
  return app.createDocument(options);
}

async function CreateShapeLayer() {
  // Taken from the Alchemist Plugin
  // Could be simplified

  return action.batchPlay(
    [
      {
        _obj: 'make',
        _target: [{ _ref: 'contentLayer' }],
        using: {
          _obj: 'contentLayer',
          type: { _obj: 'solidColorLayer', color: { _obj: 'RGBColor', red: 0, grain: 0, blue: 0 } },
          shape: {
            _obj: 'rectangle',
            unitValueQuadVersion: 1,
            top: { _unit: 'pixelsUnit', _value: 3 },
            left: { _unit: 'pixelsUnit', _value: 104 },
            bottom: { _unit: 'pixelsUnit', _value: 212 },
            right: { _unit: 'pixelsUnit', _value: 389 },
            topRight: { _unit: 'pixelsUnit', _value: 20 },
            topLeft: { _unit: 'pixelsUnit', _value: 20 },
            bottomLeft: { _unit: 'pixelsUnit', _value: 20 },
            bottomRight: { _unit: 'pixelsUnit', _value: 20 },
          },
          strokeStyle: {
            _obj: 'strokeStyle',
            strokeStyleVersion: 2,
            strokeEnabled: true,
            fillEnabled: true,
            strokeStyleLineWidth: { _unit: 'pixelsUnit', _value: 0 },
            strokeStyleLineDashOffset: { _unit: 'pointsUnit', _value: 0 },
            strokeStyleMiterLimit: 100,
            strokeStyleLineCapType: { _enum: 'strokeStyleLineCapType', _value: 'strokeStyleButtCap' },
            strokeStyleLineJoinType: { _enum: 'strokeStyleLineJoinType', _value: 'strokeStyleMiterJoin' },
            strokeStyleLineAlignment: { _enum: 'strokeStyleLineAlignment', _value: 'strokeStyleAlignCenter' },
            strokeStyleScaleLock: false,
            strokeStyleStrokeAdjust: false,
            strokeStyleLineDashSet: [],
            strokeStyleBlendMode: { _enum: 'blendMode', _value: 'normal' },
            strokeStyleOpacity: { _unit: 'percentUnit', _value: 100 },
            strokeStyleContent: { _obj: 'solidColorLayer', color: { _obj: 'RGBColor', red: 97, grain: 97, blue: 97 } },
            strokeStyleResolution: 72,
          },
        },
        layerID: 8,
        _options: { dialogOptions: 'dontDisplay' },
      },
    ],
    {}
  );
}

async function CreateTextLayer() {
  // Taken from the Alchemist Plugin
  // Could be simplified
  await action.batchPlay(
    [
      {
        _obj: 'make',
        _target: [{ _ref: 'textLayer' }],
        using: {
          _obj: 'textLayer',
          textKey: 'Lorem Ipsum',
          warp: {
            _obj: 'warp',
            warpStyle: { _enum: 'warpStyle', _value: 'warpNone' },
            warpValue: 0,
            warpPerspective: 0,
            warpPerspectiveOther: 0,
            warpRotate: { _enum: 'orientation', _value: 'horizontal' },
          },
          textClickPoint: {
            _obj: 'paint',
            horizontal: { _unit: 'percentUnit', _value: 41 },
            vertical: { _unit: 'percentUnit', _value: 62 },
          },
          textGridding: { _enum: 'textGridding', _value: 'none' },
          orientation: { _enum: 'orientation', _value: 'horizontal' },
          antiAlias: { _enum: 'antiAliasType', _value: 'antiAliasSharp' },
          bounds: {
            _obj: 'bounds',
            left: { _unit: 'pointsUnit', _value: 0 },
            top: { _unit: 'pointsUnit', _value: -10 },
            right: { _unit: 'pointsUnit', _value: 66 },
            bottom: { _unit: 'pointsUnit', _value: 3 },
          },
          boundingBox: {
            _obj: 'boundingBox',
            left: { _unit: 'pointsUnit', _value: 1.0625 },
            top: { _unit: 'pointsUnit', _value: -9 },
            right: { _unit: 'pointsUnit', _value: 65 },
            bottom: { _unit: 'pointsUnit', _value: 2 },
          },
          textShape: [
            {
              _obj: 'textShape',
              char: { _enum: 'char', _value: 'paint' },
              orientation: { _enum: 'orientation', _value: 'horizontal' },
              transform: { _obj: 'transform', xx: 1, xy: 0, yx: 0, yy: 1, tx: 0, ty: 0 },
              rowCount: 1,
              columnCount: 1,
              rowMajorOrder: true,
              rowGutter: { _unit: 'pointsUnit', _value: 0 },
              columnGutter: { _unit: 'pointsUnit', _value: 0 },
              spacing: { _unit: 'pointsUnit', _value: 0 },
              frameBaselineAlignment: { _enum: 'frameBaselineAlignment', _value: 'alignByAscent' },
              firstBaselineMinimum: { _unit: 'pointsUnit', _value: 0 },
              base: { _obj: 'paint', horizontal: 0, vertical: 0 },
            },
          ],
          textStyleRange: [
            {
              _obj: 'textStyleRange',
              from: 0,
              to: 12,
              textStyle: {
                _obj: 'textStyle',
                styleSheetHasParent: true,
                fontPostScriptName: 'MyriadPro-Regular',
                fontName: 'Myriad Pro',
                fontStyleName: 'Regular',
                fontScript: 0,
                fontTechnology: 0,
                fontAvailable: true,
                size: { _unit: 'pointsUnit', _value: 12 },
                impliedFontSize: { _unit: 'pointsUnit', _value: 12 },
                horizontalScale: 100,
                verticalScale: 100,
                syntheticBold: false,
                syntheticItalic: false,
                autoLeading: true,
                tracking: 0,
                baselineShift: { _unit: 'pointsUnit', _value: 0 },
                impliedBaselineShift: { _unit: 'pointsUnit', _value: 0 },
                fontCaps: { _enum: 'fontCaps', _value: 'normal' },
                digitSet: { _enum: 'digitSet', _value: 'arabicDigits' },
                kashidas: { _enum: 'kashidas', _value: 'kashidaDefault' },
                diacXOffset: { _unit: 'pointsUnit', _value: 0 },
                diacYOffset: { _unit: 'pointsUnit', _value: 0 },
                markYDistFromBaseline: { _unit: 'pointsUnit', _value: 0 },
                baseline: { _enum: 'baseline', _value: 'normal' },
                otbaseline: { _enum: 'otbaseline', _value: 'normal' },
                strikethrough: { _enum: 'strikethrough', _value: 'strikethroughOff' },
                underline: { _enum: 'underline', _value: 'underlineOff' },
                ligature: true,
                altligature: false,
                contextualLigatures: true,
                fractions: false,
                ordinals: false,
                swash: false,
                titling: false,
                connectionForms: true,
                stylisticAlternates: false,
                stylisticSets: 0,
                ornaments: false,
                justificationAlternates: false,
                figureStyle: { _enum: 'figureStyle', _value: 'normal' },
                proportionalMetrics: false,
                kana: false,
                italics: false,
                baselineDirection: { _enum: 'baselineDirection', _value: 'withStream' },
                textLanguage: { _enum: 'textLanguage', _value: 'ukenglishLanguage' },
                japaneseAlternate: { _enum: 'japaneseAlternate', _value: 'defaultForm' },
                mojiZume: 0,
                gridAlignment: { _enum: 'gridAlignment', _value: 'roman' },
                noBreak: false,
                color: { _obj: 'grayscale', gray: 46 },
                strokeColor: { _obj: 'grayscale', gray: 100 },
                baseParentStyle: {
                  _obj: 'textStyle',
                  fontPostScriptName: 'MyriadPro-Regular',
                  fontName: 'Myriad Pro',
                  fontStyleName: 'Regular',
                  fontScript: 0,
                  fontTechnology: 0,
                  fontAvailable: true,
                  size: { _unit: 'pointsUnit', _value: 12 },
                  impliedFontSize: { _unit: 'pointsUnit', _value: 12 },
                  horizontalScale: 100,
                  verticalScale: 100,
                  syntheticBold: false,
                  syntheticItalic: false,
                  autoLeading: true,
                  tracking: 0,
                  baselineShift: { _unit: 'pointsUnit', _value: 0 },
                  impliedBaselineShift: { _unit: 'pointsUnit', _value: 0 },
                  characterRotation: 0,
                  autoKern: { _enum: 'autoKern', _value: 'metricsKern' },
                  fontCaps: { _enum: 'fontCaps', _value: 'normal' },
                  digitSet: { _enum: 'digitSet', _value: 'defaultDigits' },
                  dirOverride: { _enum: 'dirOverride', _value: 'dirOverrideDefault' },
                  kashidas: { _enum: 'kashidas', _value: 'kashidaDefault' },
                  diacVPos: { _enum: 'diacVPos', _value: 'diacVPosOpenType' },
                  diacXOffset: { _unit: 'pointsUnit', _value: 0 },
                  diacYOffset: { _unit: 'pointsUnit', _value: 0 },
                  markYDistFromBaseline: { _unit: 'pointsUnit', _value: 100 },
                  baseline: { _enum: 'baseline', _value: 'normal' },
                  otbaseline: { _enum: 'otbaseline', _value: 'normal' },
                  strikethrough: { _enum: 'strikethrough', _value: 'strikethroughOff' },
                  underline: { _enum: 'underline', _value: 'underlineOff' },
                  underlineOffset: { _unit: 'pointsUnit', _value: 0 },
                  ligature: true,
                  altligature: false,
                  contextualLigatures: false,
                  alternateLigatures: false,
                  oldStyle: false,
                  fractions: false,
                  ordinals: false,
                  swash: false,
                  titling: false,
                  connectionForms: false,
                  stylisticAlternates: false,
                  stylisticSets: 0,
                  ornaments: false,
                  justificationAlternates: false,
                  figureStyle: { _enum: 'figureStyle', _value: 'normal' },
                  proportionalMetrics: false,
                  kana: false,
                  italics: false,
                  ruby: false,
                  baselineDirection: { _enum: 'baselineDirection', _value: 'rotated' },
                  textLanguage: { _enum: 'textLanguage', _value: 'englishLanguage' },
                  japaneseAlternate: { _enum: 'japaneseAlternate', _value: 'defaultForm' },
                  mojiZume: 0,
                  gridAlignment: { _enum: 'gridAlignment', _value: 'roman' },
                  enableWariChu: false,
                  wariChuCount: 2,
                  wariChuLineGap: 0,
                  wariChuScale: 0.5,
                  wariChuWidow: 2,
                  wariChuOrphan: 2,
                  wariChuJustification: { _enum: 'wariChuJustification', _value: 'wariChuAutoJustify' },
                  tcyUpDown: 0,
                  tcyLeftRight: 0,
                  leftAki: -1,
                  rightAki: -1,
                  jiDori: 0,
                  noBreak: false,
                  color: { _obj: 'RGBColor', red: 0, grain: 0, blue: 0 },
                  strokeColor: { _obj: 'RGBColor', red: 0, grain: 0, blue: 0 },
                  fill: true,
                  stroke: false,
                  fillFirst: true,
                  fillOverPrint: false,
                  strokeOverPrint: false,
                  lineCap: { _enum: 'lineCap', _value: 'buttCap' },
                  lineJoin: { _enum: 'lineJoin', _value: 'miterJoin' },
                  lineWidth: { _unit: 'pointsUnit', _value: 1 },
                  miterLimit: { _unit: 'pointsUnit', _value: 4 },
                  lineDashoffset: 0,
                },
              },
            },
          ],
          paragraphStyleRange: [
            {
              _obj: 'paragraphStyleRange',
              from: 0,
              to: 12,
              paragraphStyle: {
                _obj: 'paragraphStyle',
                styleSheetHasParent: true,
                directionType: { _enum: 'directionType', _value: 'dirLeftToRight' },
                textComposerEngine: { _enum: 'textComposerEngine', _value: 'textOptycaComposer' },
              },
            },
          ],
          kerningRange: [],
        },
        layerID: 4,
        _options: { dialogOptions: 'dontDisplay' },
      },
    ],
    {}
  );
}

async function ApplyLayerEffects() {
  await action.batchPlay(
    [
      {
        _obj: 'set',
        _target: [
          { _ref: 'property', _property: 'layerEffects' },
          { _ref: 'layer', _enum: 'ordinal', _value: 'targetEnum' },
        ],
        to: {
          _obj: 'layerEffects',
          scale: { _unit: 'percentUnit', _value: 100 },
          dropShadow: {
            _obj: 'dropShadow',
            enabled: true,
            present: true,
            showInDialog: true,
            mode: { _enum: 'blendMode', _value: 'normal' },
            color: { _obj: 'RGBColor', red: 11, grain: 81, blue: 126 },
            opacity: { _unit: 'percentUnit', _value: 100 },
            useGlobalAngle: true,
            localLightingAngle: { _unit: 'angleUnit', _value: 90 },
            distance: { _unit: 'pixelsUnit', _value: 1 },
            chokeMatte: { _unit: 'pixelsUnit', _value: 100 },
            blur: { _unit: 'pixelsUnit', _value: 7 },
            noise: { _unit: 'percentUnit', _value: 0 },
            antiAlias: false,
            transferSpec: { _obj: 'shapeCurveType', name: 'Linear' },
            layerConceals: true,
          },
          frameFX: {
            _obj: 'frameFX',
            enabled: true,
            present: true,
            showInDialog: true,
            style: { _enum: 'frameStyle', _value: 'insetFrame' },
            paintType: { _enum: 'frameFill', _value: 'solidColor' },
            mode: { _enum: 'blendMode', _value: 'normal' },
            opacity: { _unit: 'percentUnit', _value: 100 },
            size: { _unit: 'pixelsUnit', _value: 7 },
            color: { _obj: 'RGBColor', red: 72, grain: 128, blue: 205 },
            overprint: false,
          },
        },
        _options: { dialogOptions: 'dontDisplay' },
      },
    ],
    {}
  );
}

async function targetFunction(executionContext: ExecutionContext) {
  executionContext.reportProgress({ value: 0.25, commandName: 'Creating New Document And layers' });

  app.activeDocument = await CreateNewDocument();
  await CreateShapeLayer();

  const shapeLayer = app.activeDocument.layers[0];
  app.activeDocument.activeLayers.push(shapeLayer);

  await ApplyLayerEffects();
  await CreateTextLayer();
  executionContext.reportProgress({ value: 0.5, commandName: 'Applying metadata to layers' });

  await InitLayers();
  executionContext.reportProgress({ value: 0.75, commandName: 'Slicing layer' });

  await InitSlices(shapeLayer);

  app.activeDocument.guides[0].coordinate = 100;
  app.activeDocument.guides[1].coordinate = 100;
  app.activeDocument.guides[2].coordinate = app.activeDocument.width - 100;
  app.activeDocument.guides[3].coordinate = app.activeDocument.height - 100;
  await ApplySlices(shapeLayer);

  executionContext.reportProgress({ value: 0.9, commandName: 'Running Export Process...' });
  await ExportProcess();
}

export async function RunTest() {
  try {
    await core.executeAsModal(targetFunction, { commandName: 'User Cancel Test' });
  } catch (e) {
    await core.showAlert(e);
  }
}
