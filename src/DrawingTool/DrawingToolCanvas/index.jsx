import React, { useEffect } from "react";
const DrawingToolCanvas = ({
    width,
    height,
    sendCanvasReferenceCallBack,
    showDrawings
}) => {

    const internalWidth = (!isNaN(width)) ? Number(width) : 0;
    const internalHeight = (!isNaN(height)) ? Number(height) : 0;
    const internalSendCanvasReferenceCallBack = (typeof sendCanvasReferenceCallBack === "function") ? sendCanvasReferenceCallBack : ()=>{};
    //const internalShowDrawings = (typeof showDrawings === "boolean") ? showDrawings : true;
    let newCanvas = null;
    let canvasContainer = null;

    useEffect(()=>{
        canvasContainer = document.createElement("div");
        canvasContainer.width = internalWidth;
        canvasContainer.height = internalHeight;
        newCanvas = document.createElement("canvas");
        canvasContainer.appendChild(newCanvas);
        newCanvas.height = internalHeight;
        newCanvas.width = internalWidth; 
        internalSendCanvasReferenceCallBack(canvasContainer,newCanvas);
        return (()=> {
            newCanvas.remove();
            canvasContainer.remove()
        });
    }
    ,[]);

    return (
        <>
        </>
    );
}

export default DrawingToolCanvas;
