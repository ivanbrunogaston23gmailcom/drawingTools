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
    clearAndRepaintCanvas,
}) => {
    const internalGetWritingData = (typeof getInternalWritingData === "function") ?  getInternalWritingData : ()=> { return {}};
    const internalWritingData = internalGetWritingData();
    const internalreportInteractionCallBack = (typeof reportInteractionCallBack === "function") ? reportInteractionCallBack : ()=>{};
    const internalShowDrawingToolBar = (typeof showDrawingToolBar === "boolean") ? showDrawingToolBar : true;
    const interactionLayerReference = useRef(null);
    const currentlySelectedShape = useRef(-1);
    const newShapeParams = useRef({
        shapeType: "pen tool",
        shapeColor: "brown",
        lineWidth: 10
    });
    let mouseIsClicked = false;
    let shapeDraggingInProgress = false;
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
        mouseIsClicked = true;
        console.log(e.target.parentElement.parentElement.id);
        if(e.target.id === "drawingToolImageFocusTarget"){
            return;
        }
        let previouslySelectedShape = currentlySelectedShape.current;
        currentlySelectedShape.current = clickDetection(e,internalWritingData);
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
            changeDrawingTargetFocus(setDrawingTargetProps,internalWritingData[currentlySelectedShape.current]);
        }
        if (previouslySelectedShape >= 0 && currentlySelectedShape.current >= 0) {
            changeDrawingTargetFocus(setDrawingTargetProps,internalWritingData[currentlySelectedShape.current]);
        }
    }
    
    const dragHandler = (e) => {
        if (mouseIsClicked && currentlySelectedShape.current >= 0) {
            shapeDraggingInProgress = true;
            const dragOffset = {
                xCoordinate: e.movementX,
                yCoordinate: e.movementY,
            }            
            let mainTarget = document.getElementById('drawingToolImageFocusTarget');

            mainTarget.style.left = `${Number(mainTarget.style.left.substring(0, mainTarget.style.left.length - 2)) + e.movementX}px`;
            mainTarget.style.top = `${Number(mainTarget.style.top.substring(0, mainTarget.style.top.length - 2)) + e.movementY}px`;

            handleDrag(dragOffset,currentlySelectedShape.current,internalWritingData);
            clearAndRepaintCanvas(internalWritingData);
        }
    }
    const handleMouseUp = (e) => {
        mouseIsClicked = false;
        if (shapeDraggingInProgress) {
            shapeDraggingInProgress = false;
            const interactionCallBackMessage = {
                userAction: "dragShape",
                currentlySelectedShape: currentlySelectedShape.current,
                updatedimageList: internalWritingData
            };
            changeDrawingTargetFocus(setDrawingTargetProps,internalWritingData[currentlySelectedShape.current]);
            internalreportInteractionCallBack(interactionCallBackMessage);
        }
    }
    const internalZIndex = (!isNaN(zIndex) && Number(zIndex) >= 0 ) ? Number(zIndex) : 1;
    useEffect(()=>{
        interactionLayerReference.current.addEventListener("mousedown",handleClick);
        interactionLayerReference.current.addEventListener("mousemove",dragHandler);
        interactionLayerReference.current.addEventListener("mouseup",handleMouseUp);
        return (()=> {
            interactionLayerReference.current.removeEventListener("mousedown",handleClick);
            interactionLayerReference.current.removeEventListener("mousemove",dragHandler);
            interactionLayerReference.current.removeEventListener("mousemove",handleMouseUp);
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