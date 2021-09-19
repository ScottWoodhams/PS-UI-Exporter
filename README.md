## Currently in development 

# UI Exporter Photoshop Plugin
This photoshop plugin will export layers and data to be imported into a game engine for quickly building UI.



## Engines supported (Separate Repos to be linked)
 - None


# Development guide
## Loading in Photoshop
https://www.adobe.io/photoshop/uxp/guides/uxp-developer-tool/

You can load this plugin directly in Photoshop by using the UXP Developer Tools application. Once started, click "Add Plugin...", and navigate to the "manifest.json" file in this folder. Then click the ••• button next to the corresponding entry in the developer tools and click "Load". Switch over to Photoshop, and the plugin's panel will be running.

## Coding
- Use `npm install` to download the needed dev-dependencies.
- This project used a mixture of Javascript and typescript, this is split up where the only manually made Javascript file is the Index.js everything else is Typescript
- This project uses the standard code style https://standardjs.com

## Packaging
To package the plugin, you need to use the UXP Developer Tool. Click on the ••• button next to the entry in the developers tools and click Package". This will create a single file ready to distribute. Double clicking the file will get the user setup with the plugin thropugh Adobes Creative Service and can be disabled/uninstalled through that as well
