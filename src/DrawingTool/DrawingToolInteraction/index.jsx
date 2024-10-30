import React from "react";
import DrawingToolBar from "../DrawingToolBar";
import './index.css';



const DrawingToolInteraction = ({
    writingData,
    reportInteractionCallBack,
    showDrawingToolBar
}) => {
    const internalWritingData = (typeof writingData === "object") ?  writingData : {};
    const internalreportInteractionCallBack = (typeof reportInteractionCallBack === "function") ? reportInteractionCallBack : ()=>{};
    const internalShowDrawingToolBar = (typeof showDrawingToolBar === "boolean") ? showDrawingToolBar : true;


    return (
    <>
        <div className ={"react-drawing-tool-interactions"}>
            Container
        </div>
        {
            internalShowDrawingToolBar && (
                <div zIndex={2} style={{position: 'absolute', top: window.innerHeight - 30}}>
                    <DrawingToolBar/>
                </div>
            )
        }

    </>
    );
}


export default DrawingToolInteraction;