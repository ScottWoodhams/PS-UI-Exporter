// Index is only UI to communicate to functionality. Majority of functionality should be done in typescript.
const { ExecuteExport } = require('./build/ExportProcess')
const {ReadFromMetaData, WriteToMetaData } = require('./build/Metadata')

const { app, action } = window.require('photoshop')
const { entrypoints } = window.require('uxp')

document.getElementById('btnExport').addEventListener('click', ExecuteExport)