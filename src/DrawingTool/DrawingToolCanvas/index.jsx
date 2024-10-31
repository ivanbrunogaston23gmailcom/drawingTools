import React, { useEffect } from "react";
import './index.css';
const DrawingToolCanvas = ({
    width,
    height,
    sendCanvasReferenceCallBack,
    showDrawings,
    zIndex
}) => {

    const internalWidth = (!isNaN(width)) ? Number(width) : 0;
    const internalHeight = (!isNaN(height)) ? Number(height) : 0;
    const internalSendCanvasReferenceCallBack = (typeof sendCanvasReferenceCallBack === "function") ? sendCanvasReferenceCallBack : ()=>{};
    //const internalShowDrawings = (typeof showDrawings === "boolean") ? showDrawings : true;
    let newCanvas = null;
    let canvasContainer = null;
    const internalZIndex = (!isNaN(zIndex) && Number(zIndex) >= 0 ) ? Number(zIndex) : 0;

    useEffect(()=>{
        canvasContainer = document.createElement("div");
        canvasContainer.width = internalWidth;
        canvasContainer.height = internalHeight;
        canvasContainer.className = "react-drawing-tool-canvas";
        canvasContainer.style.zIndex = internalZIndex;
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
