// this refers to connecting to an outside library of components stored in-engine.

/**
 * Open up the component dialog inorder to assign the layer to a component
 * @constructor
 */
export async function OpenModelDialog(){
    const componentDialog = document.getElementById('dialog-component')
    //@ts-ignore
    const r = await componentDialog?.uxpShowModal({
        title: 'Set Component',
        resize: 'none', // "both", "horizontal", "vertical",
        size: {
            width: 464,
            height: 380
        },
        titleVisibility: 'hide'
    })

    console.log(r)
}

/**
 * Update the layer metadata to assign the component to, checking if the layer is compatible
 * @constructor
 */
async function UpdateLayerComponent(){

}