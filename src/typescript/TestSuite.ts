import { app, DocumentCreateOptions, core, ExecutionContext, action } from 'photoshop';

async function targetFunction(executionContext: ExecutionContext) {
  // todo create new document
  executionContext.reportProgress({ value: 0.25, commandName: 'Creating New Document And layers' });
  //let testDoc = await CreateNewDocument();
  // todo create shape layer
  //await testDoc.createLayer();

  // todo create text layer

  // todo create layer with effects

  // todo create metadata for layers
  executionContext.reportProgress({ value: 0.5, commandName: 'Applying metadata to layers' });

  // todo slice layer
  executionContext.reportProgress({ value: 0.75, commandName: 'Slicing layer' });

  // todo export
  executionContext.reportProgress({ value: 1, commandName: 'Running Export Process...' });
}

export async function RunTest() {
  await core.executeAsModal(targetFunction, { commandName: 'User Cancel Test' });
}

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

//todo clean this function
async function CreateShapeLayer() {
  const result = await action.batchPlay(
    [
      {
        _obj: 'make',
        _target: [
          {
            _ref: 'contentLayer',
          },
        ],
        using: {
          _obj: 'contentLayer',
          type: {
            _obj: 'solidColorLayer',
            color: {
              _obj: 'RGBColor',
              red: 0,
              grain: 0,
              blue: 0,
            },
          },
          shape: {
            _obj: 'rectangle',
            unitValueQuadVersion: 1,
            top: {
              _unit: 'pixelsUnit',
              _value: 3,
            },
            left: {
              _unit: 'pixelsUnit',
              _value: 104,
            },
            bottom: {
              _unit: 'pixelsUnit',
              _value: 212,
            },
            right: {
              _unit: 'pixelsUnit',
              _value: 389,
            },
            topRight: {
              _unit: 'pixelsUnit',
              _value: 20,
            },
            topLeft: {
              _unit: 'pixelsUnit',
              _value: 20,
            },
            bottomLeft: {
              _unit: 'pixelsUnit',
              _value: 20,
            },
            bottomRight: {
              _unit: 'pixelsUnit',
              _value: 20,
            },
          },
          strokeStyle: {
            _obj: 'strokeStyle',
            strokeStyleVersion: 2,
            strokeEnabled: true,
            fillEnabled: true,
            strokeStyleLineWidth: {
              _unit: 'pixelsUnit',
              _value: 0,
            },
            strokeStyleLineDashOffset: {
              _unit: 'pointsUnit',
              _value: 0,
            },
            strokeStyleMiterLimit: 100,
            strokeStyleLineCapType: {
              _enum: 'strokeStyleLineCapType',
              _value: 'strokeStyleButtCap',
            },
            strokeStyleLineJoinType: {
              _enum: 'strokeStyleLineJoinType',
              _value: 'strokeStyleMiterJoin',
            },
            strokeStyleLineAlignment: {
              _enum: 'strokeStyleLineAlignment',
              _value: 'strokeStyleAlignCenter',
            },
            strokeStyleScaleLock: false,
            strokeStyleStrokeAdjust: false,
            strokeStyleLineDashSet: [],
            strokeStyleBlendMode: {
              _enum: 'blendMode',
              _value: 'normal',
            },
            strokeStyleOpacity: {
              _unit: 'percentUnit',
              _value: 100,
            },
            strokeStyleContent: {
              _obj: 'solidColorLayer',
              color: {
                _obj: 'RGBColor',
                red: 97.72816434502602,
                grain: 97.72816434502602,
                blue: 97.72816434502602,
              },
            },
            strokeStyleResolution: 72,
          },
        },
        layerID: 8,
        _options: {
          dialogOptions: 'dontDisplay',
        },
      },
    ],
    {}
  );
}
