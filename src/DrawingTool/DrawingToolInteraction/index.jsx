import React, { useEffect, useRef } from "react";
import DrawingToolBar from "../DrawingToolBar";
import './index.css';
import DrawningToolDrawingTarget from "../DrawingToolDrawingTarget";



const DrawingToolInteraction = ({
    writingData,
    reportInteractionCallBack,
    showDrawingToolBar,
    zIndex
}) => {
    const internalWritingData = (typeof writingData === "object") ?  writingData : {};
    const internalreportInteractionCallBack = (typeof reportInteractionCallBack === "function") ? reportInteractionCallBack : ()=>{};
    const internalShowDrawingToolBar = (typeof showDrawingToolBar === "boolean") ? showDrawingToolBar : true;
    const interactionLayerReference = useRef(null);
    const functionTest = (e) => {
        console.log("e",e);
        console.log(interactionLayerReference.current.parentElement);
    }
    const internalZIndex = (!isNaN(zIndex) && Number(zIndex) >= 0 ) ? Number(zIndex) : 1;
    useEffect(()=>{
        interactionLayerReference.current.addEventListener('mousedown', functionTest);
        interactionLayerReference.current.addEventListener("mouseup", functionTest);
        interactionLayerReference.current.addEventListener("mousemove", functionTest);
        return (()=> { 
            interactionLayerReference.current.removeEventListener('mousedown',functionTest);
            interactionLayerReference.current.removeEventListener("mouseup", functionTest);
            interactionLayerReference.current.removeEventListener("mousemove", functionTest);
        })
    },[]);
    return (
    <div 
        ref={interactionLayerReference}
        className ={"react-drawing-tool-interactions"}
        style={{zIndex: internalZIndex}}
    >
        <div>
            Container
            <DrawningToolDrawingTarget/>
        </div>
        {
            internalShowDrawingToolBar && (
                <div style={{position: 'absolute', top: window.innerHeight - 30, zIndex: 2}}>
                    <DrawingToolBar/>
                </div>
            )
        }

    </div>
    );
}


export default DrawingToolInteraction;