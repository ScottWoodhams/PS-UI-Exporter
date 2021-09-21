// Index is only UI to communicate to functionality. Majority of functionality should be done in typescript.
const { ExecuteExport,  } = require('./build/ExportProcess')
const {ReadFromMetaData, WriteToMetaData, UpdateMetaProperty } = require('./build/Metadata')
const {GetLayerDesc, CreateUILayerData, GetTextKey} = require('./build/UILayerData')
const {InitialSetup} = require('./build/DataManipulation')
const { app, action } = window.require('photoshop')
const { entrypoints } = window.require('uxp')
const {Setup, ApplyToLayerData} = require('./build/Slicing')

const btnSetup = document.getElementById('btnSetup')
const btnExport = document.getElementById('btnExport')
const btnSlice = document.getElementById('btnSlice')

const btnApplySlice = document.getElementById('btnApplySlice')

btnExport.disabled = true
btnApplySlice.disabled = true

btnSetup.addEventListener('click', InitialSetup)
btnSetup.addEventListener('click', function () {btnExport.disabled = false })
btnExport.addEventListener('click', ExecuteExport)

btnSlice.addEventListener('click', async function () {await Setup()})
btnSlice.addEventListener('click', function () {btnApplySlice.disabled = false} )

btnApplySlice.addEventListener('click', async function (){
  await ApplyToLayerData()
})

