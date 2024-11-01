import React, { useEffect, useRef, useState } from "react";
import DrawingToolBar from "../DrawingToolBar";
import './index.css';
import DrawningToolDrawingTarget from "../DrawingToolDrawingTarget";
import { addStroke, clickDetection, handleDrag } from '../../HelperFunctions';
import { changeDrawingTargetFocus } from '../../HelperFunctions/ImageFocusTargetFunctions';


const DrawingToolInteraction = ({
    getInternalWritingData,
    reportInteractionCallBack,
    showDrawingToolBar,
    zIndex,
    clearAndRepaintCanvas
}) => {
    const internalGetWritingData = (typeof getInternalWritingData !== "function") ?  getInternalWritingData : ()=> { return {}};
    const internalreportInteractionCallBack = (typeof reportInteractionCallBack === "function") ? reportInteractionCallBack : ()=>{};
    const internalShowDrawingToolBar = (typeof showDrawingToolBar === "boolean") ? showDrawingToolBar : true;
    const interactionLayerReference = useRef(null);
    const currentlySelectedShape = useRef(-1);
    const newShapeParams = useRef({
        shapeType: "pen tool",
        shapeColor: "brown",
        lineWidth: 10
    });
    const [drawingTargetProps, setDrawingTargetProps] = useState({
        height: 1,
        width: 1,
        top: 0,
        left: 0,
        isVisible: false
    })
    const getCurrentlySelectedDrawing = () => {
        return currentlySelectedShape.current;
    }
    const handleClick = (e, focusTargetInfo = {fromFocusTarget: false, selectedShape: -1}) => {
        let drawingInfo = getInternalWritingData(); 
        if(focusTargetInfo.fromFocusTarget){
            return;
        }
        let previouslySelectedShape = currentlySelectedShape.current;
        currentlySelectedShape.current = clickDetection(e,drawingInfo);
        if (previouslySelectedShape === currentlySelectedShape.current) {
            return;
        }
        if (previouslySelectedShape >= 0 && currentlySelectedShape.current < 0) {
            setDrawingTargetProps({
                height: 1,
                width: 1,
                top: 0,
                left: 0,
                isVisible: false
            });
        }
        if (previouslySelectedShape < 0 && currentlySelectedShape.current >= 0) {            
            changeDrawingTargetFocus(setDrawingTargetProps,drawingInfo[currentlySelectedShape.current]);
        }
        if (previouslySelectedShape >= 0 && currentlySelectedShape.current >= 0 && previouslySelectedShape !== currentlySelectedShape.current) {
            changeDrawingTargetFocus(setDrawingTargetProps,drawingInfo[currentlySelectedShape.current]);
        }
    }
    
    const dragHandler = (e) => {
        const internalWritingData = getInternalWritingData();
        const dragOffset = {
            xCoordinate: e.movementX,
            yCoordinate: e.movementY,
        }
        handleDrag(dragOffset,currentlySelectedShape.current,internalWritingData);
        clearAndRepaintCanvas(internalWritingData);
        
    }
    const internalZIndex = (!isNaN(zIndex) && Number(zIndex) >= 0 ) ? Number(zIndex) : 1;
    useEffect(()=>{
        interactionLayerReference.current.addEventListener("mousedown",handleClick);
        return (()=> {
            interactionLayerReference.current.removeEventListener("mousedown",handleClick);
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
            <DrawningToolDrawingTarget
                height = {drawingTargetProps.height}
                width = {drawingTargetProps.width}
                top = {drawingTargetProps.top}
                left = {drawingTargetProps.left}
                isVisible = {drawingTargetProps.isVisible}
                handleClick = {handleClick}
                getCurrentlySelectedDrawing = {getCurrentlySelectedDrawing}
                dragHandler={dragHandler}      
            />
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