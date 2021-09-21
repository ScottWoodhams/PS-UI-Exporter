// Index is only UI to communicate to functionality. Majority of functionality should be done in typescript.
const { ExecuteExport,  } = require('./build/ExportProcess')
const {ReadFromMetaData, WriteToMetaData } = require('./build/Metadata')
const {GetLayerDesc, CreateUILayerData, GetTextKey} = require('./build/UILayerData')
const {InitialSetup} = require('./build/DataManipulation')
const { app, action } = window.require('photoshop')
const { entrypoints } = window.require('uxp')


//document.getElementById('btnExport').addEventListener('click', ExecuteExport)
const btnSetup = document.getElementById('btnSetup')
const btnExport = document.getElementById('btnExport')
btnExport.disabled = true

btnSetup.addEventListener('click', InitialSetup)
btnSetup.addEventListener('click', function () {btnExport.disabled = false})
btnExport.addEventListener('click', ExecuteExport)
