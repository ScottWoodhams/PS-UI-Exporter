import '@babel/polyfill';
import React from 'react';
import { entrypoints } from 'uxp';
import { app, core, action } from 'photoshop';
import * as uxp from 'uxp';
import App from './App';
import PanelController from './Controllers/PanelController';
import MenuFlyout from './typescript/MenuFlyout';
import { RunTest } from './typescript/TestSuite';

console.clear();

async function targetFunction() {
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
    {

    }
  );
}

async function testFun() {
  await core.executeAsModal(targetFunction, { commandName: 'User Cancel Test' });
}

entrypoints.setup({
  commands: { runTests: RunTest, test: testFun },
  panels: {
    MainPanel: PanelController(<App />, { ...MenuFlyout }),
  },
});
